import { paths } from "../utils/paths.jsx";
import { Link } from "react-router-dom";

export default function Component() {
  return (
    <div>
      <Link to={paths.newUser()}>Créer un compte utilisateur</Link>{" "}
      <Link to={paths.home()}>Retour à l'accueil</Link>
    </div>
  );
}
