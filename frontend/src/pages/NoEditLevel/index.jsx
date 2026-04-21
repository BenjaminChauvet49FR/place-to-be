import UserOrLobby from "../../components/UserOrLobby.jsx";
export default function Page() {
  return (
    <div>
      Vous tentez d'accéder à une page d'édition de niveau(x). Seul l'auteur
      du/des niveau(x) peut y accéder.
      <br />
      Si c'est vous, veuillez vous connecter. <UserOrLobby />
    </div>
  );
}
