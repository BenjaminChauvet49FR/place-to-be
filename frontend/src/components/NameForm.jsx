import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths.jsx";
import { connect } from "../utils/api.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Component() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, useLogin, logout } = useAuth();
  const { login } = useLogin();

  const navigate = useNavigate();

  const handleChange = (event) => setName(event.target.value);

  const handleSubmitConnect = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    const result = await connect(name, password);

    if (result.success) {
      // Mettre à jour le contexte global Auth
      login(
        { username: name, permissions: result.data.user.permissions },
        result.data.access,
      );
    } else if (
      result.error.includes(
        "No active account found with the given credentials",
      ) // NOTE : pourquoi directement un include message d'erreur ? Eh bien parce que quand on tente de se connecter (connect) on s'arrête avec une exception si le serveur est inactif, mais on continue avec un statut (401, etc...) si le serveur est actif ; je souhaite uniformiser les traitements, donc juste renvoyer l'erreur
    ) {
      // Afficher le message d'erreur
      setError("Nom ou mot de passe incorrect !");
    } else if (result.error.includes("Failed to fetch")) {
      setError("Connexion au serveur non assurée !");
    }
  };

  const handleSubmitDisconnect = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    // Mettre à jour le contexte global Auth
    logout();
    // Rediriger vers page d'accueil
    navigate(paths.home());
  };

  return (
    <div>
      {user !== null ? (
        <form onSubmit={handleSubmitDisconnect} id="form_name">
          <span data-testid="span-welcoming">Bienvenue {user.username}</span>
          <input
            data-testid="button-disconnect"
            type="submit"
            value="Se déconnecter"
          />
        </form>
      ) : (
        <form onSubmit={handleSubmitConnect} id="form_name">
          <label>
            Nom :&nbsp;
            <input
              data-testid="input-username"
              type="text"
              value={name}
              onChange={handleChange}
            />
          </label>
          <label>
            Mot de passe :&nbsp;
            <input
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <input
            data-testid="button-connect"
            type="submit"
            value="Se connecter"
          />
          {error && <span style={{ color: "red" }}>{error}</span>}
        </form>
      )}
    </div>
  );
}
