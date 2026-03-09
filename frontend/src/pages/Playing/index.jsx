import { useContext } from "react";
import { LevelContext } from "../../context/LevelContext";

export default function Playing() {
  const { state, dispatch } = useContext(LevelContext);
  return <div>En cours de construction... (niveau : {state.levelName})</div>;
}
