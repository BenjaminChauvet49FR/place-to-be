import { paths } from "../../index.js";
import { Link } from "react-router-dom";

export default function NoEditLevel() {
  return (
    <div>
      Vous tentez d'accéder à une page d'édition de niveau(x). Seul l'auteur
      du/des niveau(x) peut y accéder.
      <br />
      Si c'est vous, veuillez vous connecter.
      <Link to={paths.home()}>Retour à l'accueil</Link>
    </div>
  );
}
