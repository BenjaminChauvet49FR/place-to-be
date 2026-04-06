import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../index.js";
import { connect } from "../utils/api.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function NameForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleChange = (event) => setName(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    const result = await connect(name, password);

    if (result.success) {
      // Mettre à jour le contexte global Auth
      login({ username: name }, result.data.access);

      // Rediriger vers dashboard
      navigate(paths.levelListForEditor());
    } else {
      // Afficher le message d'erreur
      setError("Nom ou mot de passe incorrect !");
    }
  };

  return (
    <form onSubmit={handleSubmit} id="form_name">
      <label>
        Nom :&nbsp;
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <label>
        Mot de passe :&nbsp;
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Se connecter" />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </form>
  );
}

export default NameForm;
