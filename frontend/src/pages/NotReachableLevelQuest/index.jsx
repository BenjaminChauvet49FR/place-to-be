import { paths } from "../../utils/paths.jsx";
import { Link } from "react-router-dom";
import image from "../../images/Pas_de_bloc.png";

export default function Page() {
  return (
    <div>
      <img src={image} alt="Pas de bloc" />
      <br />
      Vous tentez d'atteindre un niveau inexistant ou non débloqué !{" "}
      <Link to={paths.home()}>Retour à l'accueil</Link>
    </div>
  );
}
