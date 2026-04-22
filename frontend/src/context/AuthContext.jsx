import { createContext, useContext, useState, useEffect } from "react";
import { API_URL, getLastLevelNumber } from "../utils/api.jsx";
import { MainQuestContext } from "./MainQuestContext.jsx";

const AuthContext = createContext(null);

export default function Provider({ children }) {
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
        console.log("me status:", res.status);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    }

    init();
  }, []);

  function useLogin() {
    const mqc = useContext(MainQuestContext);

    async function login(userData, token) {
      setUser(userData);
      localStorage.setItem("access_token", token);

      // Setup le nombre de niveaux de la quête principale
      let llnData = await getLastLevelNumber();
      if (llnData.success) {
        mqc.dispatch({
          type: "lastLevelNumber",
          lastLevelNumber: llnData.lastLevelNumber,
        });
      } else {
        window.alert(
          "Le nombre de niveaux de la quête principale n'a pas pu être récupéré !",
        );
      }
    }

    return { login };
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, useLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
