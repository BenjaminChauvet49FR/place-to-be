import PlayField from "../../components/PlayField.jsx";
import CommandsPanel from "../../components/CommandsPanel.jsx";
import { startLevel, dummyLevelInfos } from "../../logic/gameplay.jsx";
import { useState, useEffect } from "react";

export default function Playing() {
  const [gridF, updateGridF] = useState([[]]);
  const [levelInfos, updateLevelInfos] = useState(dummyLevelInfos());
  const [gridM, updateGridM] = useState([[]]);
  const [levelState, updateLevelState] = useState({
    moves: [],
    itemsInGrid: [],
  });

  useEffect(() => {
    startLevel(levelInfos.currentLevelID, {
      updateGridF: updateGridF,
      updateLevelInfos: updateLevelInfos,
      updateGridM: updateGridM,
      updateLevelState: updateLevelState,
    });
  }, [levelInfos.currentLevelID]);

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
