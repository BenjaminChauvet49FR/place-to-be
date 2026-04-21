import UserOrLobby from "../../components/UserOrLobby.jsx";

export default function Page() {
  return (
    <div>
      L'accès à la quête principale est réservée aux utilisateurs connectés.{" "}
      <UserOrLobby />
    </div>
  );
}
