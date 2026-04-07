import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../index.js";
import { connect } from "../utils/api.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function NameForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login, logout } = useAuth();

  const navigate = useNavigate();

  const handleChange = (event) => setName(event.target.value);

  const handleSubmitConnect = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    const result = await connect(name, password);

    if (result.success) {
      // Mettre à jour le contexte global Auth
      login({ username: name }, result.data.access);
    } else {
      // Afficher le message d'erreur
      setError("Nom ou mot de passe incorrect !");
    }
  };

  const handleSubmitDisconnect = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    const result = await connect(name, password);

    if (result.success) {
      // Mettre à jour le contexte global Auth
      logout();

      // Rediriger vers page d'accueil
      navigate(paths.home());
    } else {
      setError(error);
    }
  };

  return (
    <div>
      {user !== null ? (
        <form onSubmit={handleSubmitDisconnect} id="form_name">
          <span>Bienvenue {user.username}</span>
          <input type="submit" value="Se déconnecter" />
        </form>
      ) : (
        <form onSubmit={handleSubmitConnect} id="form_name">
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
      )}
    </div>
  );
}

export default NameForm;
