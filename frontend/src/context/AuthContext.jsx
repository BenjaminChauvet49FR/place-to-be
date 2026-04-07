import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../utils/api.jsx";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier par le biais du token (et d'un appel à l'API) si on est correctement connecté
  useEffect(() => {
    async function init() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("access_token");
      }

      setLoading(false);
    }

    init();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("access_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
