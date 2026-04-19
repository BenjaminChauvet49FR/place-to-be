import { useGameplay } from "../logic/gameplay.jsx";
import { paths, doIComeFromEditor, amIInMainQuest } from "../utils/paths.jsx";

import { DIRECTION, NO_ID_LEVEL } from "../logic/constants.jsx";

import { useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";
import { useNavigate } from "react-router-dom";

function PlayPanel() {
  const editContext = useContext(LevelEditContext);

  const navigate = useNavigate();

  function backToEdition() {
    editContext.dispatch({ type: "keepEditorState" });
    if (editContext.state.levelID === NO_ID_LEVEL) {
      navigate(paths.editNewLevel());
    } else {
      navigate(paths.editLevel(editContext.state.levelID));
    }
  }

  function backToMainQuest() {
    navigate(paths.levelListForMainQuest());
  }

  const {
    undo,
    moveBlocks,
    getBlockTypes,
    getCurrentBlockType,
    getMovesPlayed,
    getMovesLimit,
    areMovesInfinite,
    setCurrentBlockType,
  } = useGameplay();

  return (
    <div className="panel mainComponent">
      {/* Les directions */}

      <div className="directionsPanel0">
        <div className="directionsPanel">
          <div>
            <button onClick={() => moveBlocks(DIRECTION.U)}>Haut</button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.L)}>Gauche</button>
            <button onClick={() => moveBlocks(DIRECTION.R)}>Droite</button>
          </div>
          <div>
            <button onClick={() => moveBlocks(DIRECTION.D)}>Bas</button>
          </div>
        </div>
        <button onClick={() => undo()}>Annuler</button>
        <br />
      </div>

      {/* Les types de blocs (+ le nombre de coups joués) */}
      <div className="blockTypePanel0">
        {getBlockTypes().map((blockType) => (
          <div
            key={blockType}
            className={`blockTypePanel${getCurrentBlockType() === blockType ? " selected" : " not-selected"}`}
          >
            {areMovesInfinite(blockType) ? (
              <div className="moveDisplay infiniteMoves">
                {getMovesPlayed(blockType)}
              </div>
            ) : (
              <div
                className={
                  (getMovesPlayed(blockType) > getMovesLimit(blockType) &&
                    "moveDisplay tooManyMoves") ||
                  "moveDisplay"
                }
              >
                {getMovesPlayed(blockType)}/{getMovesLimit(blockType)}
              </div>
            )}

            <button
              className={`buttonSelectionPlay ${blockType}`}
              onClick={() => setCurrentBlockType(blockType)}
            >
              {blockType}
            </button>
          </div>
        ))}
      </div>

      {/* Le reste */}

      {doIComeFromEditor() ? (
        <button onClick={() => backToEdition()}>Retour a l'edition</button>
      ) : amIInMainQuest() ? (
        <button onClick={() => backToMainQuest()}>
          Retour au choix du niveau
        </button>
      ) : null}
    </div>
  );
}

export default PlayPanel;
