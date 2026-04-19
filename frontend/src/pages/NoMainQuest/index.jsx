import { paths } from "../../utils/paths.jsx";
import { Link } from "react-router-dom";

export default function NoMainQuest() {
  return (
    <div>
      L'accès à la quête principale est réservée aux utilisateurs connectés.{" "}
      <Link to={paths.newUser()}>Créer un compte utilisateur</Link>{" "}
      <Link to={paths.home()}>Retour à l'accueil</Link>
    </div>
  );
}
