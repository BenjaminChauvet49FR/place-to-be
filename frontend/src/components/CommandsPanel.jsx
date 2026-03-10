import {
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
  let luggage = {
    levelState: levelState,
    updateLevelState: updateLevelState,
    gridM: gridM,
    updateGridM: updateGridM,

    levelInfos: levelInfos,
    gridF: gridF,
  };

  return (
    <div className="panel mainComponent">
      <div className="directionsPanel0">
        <div className="directionsPanel">
          <div>
            <button onClick={() => moveBlocks(DIRECTION.U, luggage)}>
              Haut
            </button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.L, luggage)}>
              Gauche
            </button>
            <button onClick={() => moveBlocks(DIRECTION.R, luggage)}>
              Droite
            </button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.D, luggage)}>
              Bas
            </button>
          </div>
        </div>
        <button onClick={() => undo(luggage)}>Annuler</button>
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
    </div>
  );
}

export default CommandsPanel;
