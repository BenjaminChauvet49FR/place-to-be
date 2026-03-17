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
      navigate(paths.levelList());
    } else {
      // Afficher le message d'erreur
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom :
        <input type="text" value={name} onChange={handleChange} />
      </label>
      <label>
        Mot de passe :
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Se connecter" />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default NameForm;
