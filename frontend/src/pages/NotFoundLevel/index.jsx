import { paths } from "../../utils/paths.jsx";
import { Link } from "react-router-dom";

export default function NotFoundLevel() {
  return (
    <div>
      Vous tentez d'atteindre un niveau inexistant ou interdit d'accès !{" "}
      <Link to={paths.home()}>Retour à l'accueil</Link>
    </div>
  );
}
