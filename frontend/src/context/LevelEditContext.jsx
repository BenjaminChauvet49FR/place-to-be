import { createContext, useReducer } from "react";
import { levelEditReducer, initialState } from "./levelEditReducer";

export const LevelEditContext = createContext();

export default function LevelEditProvider({ children }) {
  const [state, dispatch] = useReducer(levelEditReducer, initialState);

  return (
    <LevelEditContext.Provider value={{ state, dispatch }}>
      {children}
    </LevelEditContext.Provider>
  );
}
