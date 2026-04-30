import UserOrLobby from "../../components/UserOrLobby.jsx";
import image from "../../images/Passage_interdit.png";

export default function Page() {
  return (
    <div>
      <img src={image} alt="Passage interdit" />
      <br />
      L'accès à la quête principale est réservée aux utilisateurs connectés.{" "}
      <UserOrLobby />
    </div>
  );
}
