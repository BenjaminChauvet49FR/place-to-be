import { Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import Lobby from "./pages/Lobby/index.jsx";
import NoEditLevel from "./pages/NoEditLevel/index.jsx";
import NoMainQuest from "./pages/NoMainQuest/index.jsx";
import { amIInMainQuest, amITryingToGoToAdmin } from "./utils/paths.jsx";

export default function PrivateRoute() {
  const { user, loading, amIAnAdmin } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (amITryingToGoToAdmin() && !amIAnAdmin()) {
    return <Lobby />;
  }

  if (!user) {
    if (amIInMainQuest())
      return <NoMainQuest />; /* Pour l'acces a la quete principale*/
    else return <NoEditLevel />;
    /*Pour les niveaux en edit */
  }

  return <Outlet />;
}
