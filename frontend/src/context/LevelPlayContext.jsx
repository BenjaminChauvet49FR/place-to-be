import { createContext, useReducer } from "react";
import { levelPlayReducer, initialState } from "./levelPlayReducer.jsx";

export const LevelPlayContext = createContext();

export default function LevelPlayProvider({ children }) {
  const [state, dispatch] = useReducer(levelPlayReducer, initialState);

  return (
    <LevelPlayContext.Provider value={{ state, dispatch }}>
      {children}
    </LevelPlayContext.Provider>
  );
}
