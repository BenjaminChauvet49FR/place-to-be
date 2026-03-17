import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("access_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
