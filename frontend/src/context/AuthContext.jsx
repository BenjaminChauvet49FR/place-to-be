import { createContext, useContext, useState, useEffect } from "react";
import { getLastLevelNumber, connectFromF5 } from "../utils/api.jsx";
import { MainQuestContext } from "./MainQuestContext.jsx";

const AuthContext = createContext(null);

export default function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si on est correctement connecté au démarrage de la page
  useEffect(() => {
    async function init() {
      const result = await connectFromF5();
      if (result.success) {
        setUser(result.data);
      } else {
        localStorage.removeItem("access_token");
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
