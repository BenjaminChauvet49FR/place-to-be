import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import NoEditLevel from "./pages/NoEditLevel/index.jsx";

export default function PrivateEditRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  // if (!user) return <Navigate to={paths.noEditLevel()} />; Good, but it always redirected towards the page "doNotEditLevel"... a bit weird. We can do better, by not changing the address of the page we are on.

  if (!user) return <NoEditLevel />;

  return <Outlet />;
}
