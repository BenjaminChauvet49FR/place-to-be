import { createContext, useReducer } from "react";
import { mainQuestReducer, initialState } from "./mainQuestReducer.jsx";

export const MainQuestContext = createContext();

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(mainQuestReducer, initialState);

  return (
    <MainQuestContext.Provider value={{ state, dispatch }}>
      {children}
    </MainQuestContext.Provider>
  );
}
