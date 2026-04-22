import { Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import NoEditLevel from "./pages/NoEditLevel/index.jsx";
import NoMainQuest from "./pages/NoMainQuest/index.jsx";
import { amIInMainQuest } from "./utils/paths.jsx";

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) {
    if (amIInMainQuest())
      return <NoMainQuest />; /* Pour l'acces a la quete principale*/
    else return <NoEditLevel />;
    /*Pour les niveaux en edit */
  }

  return <Outlet />;
}
