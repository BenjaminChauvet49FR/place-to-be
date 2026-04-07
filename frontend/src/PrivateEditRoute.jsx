import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import { paths } from "./index.js";

export default function PrivateEditRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;

  if (!user) return <Navigate to={paths.noEditLevel()} />;

  return <Outlet />;
}
