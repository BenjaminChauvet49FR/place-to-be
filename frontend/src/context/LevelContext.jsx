import { createContext, useReducer } from "react";
import { levelReducer, initialState } from "./levelReducer.jsx";

export const LevelContext = createContext();

export default function LevelProvider({ children }) {
  const [state, dispatch] = useReducer(levelReducer, initialState);

  return (
    <LevelContext.Provider value={{ state, dispatch }}>
      {children}
    </LevelContext.Provider>
  );
}
