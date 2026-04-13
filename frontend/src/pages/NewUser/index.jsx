import { createUser } from "../../utils/api.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../../index.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function NewUser() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => setName(event.target.value);

  const handleSubmitCreateUser = async (event) => {
    event.preventDefault();
    setError(""); // reset erreur
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    const result = await createUser(name, password);

    if (result.success) {
      // Mettre à jour le contexte global Auth
      window.alert(
        "Bienvenue, " + name + ". Passez un bon moment parmi nous !",
      );
      login({ username: name }, result.data.access); // Note : j'ai essayé sans cette ligne, et ça ne loguait pas.
      navigate(paths.home());
    } else if (result.error.includes("Failed to fetch")) {
      setError("Connexion au serveur non assurée !");
    } else if (result.error.includes("already exists")) {
      setError("Un utilisateur avec ce nom existe déjà !");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitCreateUser} id="form_create">
        <div>
          <label>
            Nom :&nbsp;
            <input type="text" value={name} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>
            Mot de passe :&nbsp;
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Répéter le mot de passe :&nbsp;
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            <input type="submit" value="Créer un utilisateur" />
            {error && <span style={{ color: "red" }}>{error}</span>}
          </label>
        </div>
      </form>
      <div>
        ATTENTION : notez bien le mot de passe, il ne pourra pas être retrouvé !
      </div>
    </div>
  );
}
