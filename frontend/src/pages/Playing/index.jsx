import PlayField from "../../components/PlayField.jsx";
import PlayPanel from "../../components/PlayPanel.jsx";
import { startLevelFromGrid } from "../../logic/gameplay.jsx";
import { useContext, useEffect } from "react";
import { LevelPlayContext } from "../../context/LevelPlayContext";
import { LevelEditContext } from "../../context/LevelEditContext";

export default function Playing() {
  const ucp = useContext(LevelPlayContext);

  const uce = useContext(LevelEditContext);

  useEffect(() => {
    startLevelFromGrid(uce.state.gridF, uce.state.gridM, ucp.dispatch);
  }, [uce.state.gridF, uce.state.gridM, ucp.dispatch]);

  return (
    <div>
      <PlayField></PlayField>
      <PlayPanel></PlayPanel>
    </div>
  );
}
