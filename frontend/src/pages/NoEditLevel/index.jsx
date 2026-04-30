import UserOrLobby from "../../components/UserOrLobby.jsx";
import image from "../../images/Passage_interdit.png";

export default function Page() {
  return (
    <div>
      {" "}
      <img src={image} alt="Passage interdit" />
      <br />
      Vous tentez d'accéder à une page d'édition de niveau(x). Seul l'auteur
      du/des niveau(x) peut y accéder.
      <br />
      Si c'est vous, veuillez vous connecter. <UserOrLobby />
    </div>
  );
}
