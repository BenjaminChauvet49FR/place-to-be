import PlayField from "../../components/PlayField.jsx";
import CommandsPanel from "../../components/CommandsPanel.jsx";
import { startLevelFromGrid, dummyLevelInfos } from "../../logic/gameplay.jsx";
import { useState, useEffect, useContext } from "react";
import { LevelContext } from "../../context/LevelContext";

export default function Playing() {
  const [gridF, updateGridF] = useState([[]]);
  const [levelInfos, updateLevelInfos] = useState(dummyLevelInfos());
  const [gridM, updateGridM] = useState([[]]);
  const [levelState, updateLevelState] = useState({
    moves: [],
    itemsInGrid: [],
  });

  const { state, _ } = useContext(LevelContext);
  const gridFFromEditor = state.gridF;
  const gridMFromEditor = state.gridM;

  useEffect(() => {
    startLevelFromGrid(gridFFromEditor, gridMFromEditor, {
      updateGridF: updateGridF,
      updateLevelInfos: updateLevelInfos,
      updateGridM: updateGridM,
      updateLevelState: updateLevelState,
    });
  }, []);

  return (
    <div className="App">
      <PlayField
        gridF={gridF}
        gridM={gridM}
        levelState={levelState}
      ></PlayField>
      <CommandsPanel
        levelInfos={levelInfos}
        updateLevelInfos={updateLevelInfos}
        gridF={gridF}
        updateGridF={updateGridF}
        gridM={gridM}
        updateGridM={updateGridM}
        levelState={levelState}
        updateLevelState={updateLevelState}
      ></CommandsPanel>
    </div>
  );
}
