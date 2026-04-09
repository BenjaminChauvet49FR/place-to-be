import {
  moveBlocks,
  undo,
  getBlockTypes,
  getCurrentBlockType,
  setCurrentBlockType,
  getMovesPlayed,
  getMovesLimit,
  areMovesInfinite,
} from "../logic/gameplay.jsx";
import { paths, doIComeFromEditor } from "../index";

import { DIRECTION, NO_ID_LEVEL } from "../logic/constants.jsx";

import { LevelPlayContext } from "../context/LevelPlayContext.jsx";
import { useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";
import { useNavigate } from "react-router-dom";

function PlayPanel() {
  const playContext = useContext(LevelPlayContext);
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

  return (
    <div className="panel mainComponent">
      {/* Les directions */}

      <div className="directionsPanel0">
        <div className="directionsPanel">
          <div>
            <button
              onClick={() =>
                moveBlocks(DIRECTION.U, playContext.state, playContext.dispatch)
              }
            >
              Haut
            </button>
          </div>
          <div>
            <button
              onClick={() =>
                moveBlocks(DIRECTION.L, playContext.state, playContext.dispatch)
              }
            >
              Gauche
            </button>
            <button
              onClick={() =>
                moveBlocks(DIRECTION.R, playContext.state, playContext.dispatch)
              }
            >
              Droite
            </button>
          </div>
          <div>
            <button
              onClick={() =>
                moveBlocks(DIRECTION.D, playContext.state, playContext.dispatch)
              }
            >
              Bas
            </button>
          </div>
        </div>
        <button onClick={() => undo(playContext.state, playContext.dispatch)}>
          Annuler
        </button>
        <br />
      </div>

      {/* Les types de blocs (+ le nombre de coups joués) */}
      <div className="blockTypePanel0">
        {getBlockTypes(playContext.state).map((blockType) => (
          <div
            key={blockType}
            className={`blockTypePanel${getCurrentBlockType(playContext.state) === blockType ? " selected" : " not-selected"}`}
          >
            {areMovesInfinite(blockType, playContext.state) ? (
              <div className="infiniteMoves">
                {getMovesPlayed(blockType, playContext.state)}
              </div>
            ) : (
              <div
                className={
                  (getMovesPlayed(blockType, playContext.state) >
                    getMovesLimit(blockType, playContext.state) &&
                    "tooManyMoves") ||
                  ""
                }
              >
                {getMovesPlayed(blockType, playContext.state)}/
                {getMovesLimit(blockType, playContext.state)}
              </div>
            )}

            <button
              className={`buttonSelection${blockType}`}
              onClick={() =>
                setCurrentBlockType(
                  blockType,
                  playContext.state,
                  playContext.dispatch,
                )
              }
            >
              {blockType}
            </button>
          </div>
        ))}
      </div>

      {/* Le reste */}

      {doIComeFromEditor() ? (
        <button onClick={() => backToEdition()}>Retour a l'edition</button>
      ) : null}
    </div>
  );
}

export default PlayPanel;
