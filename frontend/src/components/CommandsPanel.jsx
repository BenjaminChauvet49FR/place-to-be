import {
  nextLevel,
  previousLevel,
  restartLevel,
  moveBlocks,
  undo,
  getBlockTypes,
  setCurrentBlockType,
  getCurrentBlockType,
} from "../logic/gameplay.jsx";
import { DIRECTION } from "../logic/constants.jsx";

function CommandsPanel({
  gridF,
  updateGridF,
  levelInfos,
  updateLevelInfos,
  gridM,
  updateGridM,
  levelState,
  updateLevelState,
}) {
  let pStartLuggage = {
    updateGridF: updateGridF,
    updateGridM: updateGridM,
    updateLevelState: updateLevelState,
    updateLevelInfos: updateLevelInfos,
    levelInfos: levelInfos,
  };

  let pLuggage = {
    levelState: levelState,
    updateLevelState: updateLevelState,
    gridM: gridM,
    updateGridM: updateGridM,

    levelInfos: levelInfos,
    gridF: gridF,
  };

  return (
    <div className="CommandsPanel">
      <div className="directionsPanel0">
        <div className="directionsPanel">
          <div>
            <button onClick={() => moveBlocks(DIRECTION.U, pLuggage)}>
              Haut
            </button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.L, pLuggage)}>
              Gauche
            </button>
            <button onClick={() => moveBlocks(DIRECTION.R, pLuggage)}>
              Droite
            </button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.D, pLuggage)}>
              Bas
            </button>
          </div>
        </div>
        <button onClick={() => undo(pLuggage)}>Annuler</button>
        <br />
      </div>
      <div>
        Couleur active = {getCurrentBlockType(levelInfos, levelState)}
        {getBlockTypes(levelInfos).map((blockType) => (
          <button
            key={blockType}
            className={`buttonSelection${blockType}`}
            onClick={() =>
              setCurrentBlockType(blockType, levelInfos, updateLevelState)
            }
          >
            Sélectionner {blockType}
          </button>
        ))}
      </div>
      <div>
        <button onClick={() => previousLevel(pStartLuggage)}>
          Niv. précédent
        </button>
        <button onClick={() => restartLevel(pStartLuggage)}>Redémarrer</button>
        <button onClick={() => nextLevel(pStartLuggage)}>Niv. suivant</button>
      </div>
    </div>
  );
}

export default CommandsPanel;
