import { useGameplay } from "../logic/gameplay.jsx";
import {
  paths,
  doIComeFromEditor,
  amIInFreePlay,
  amIInMainQuest,
} from "../utils/paths.jsx";

import { DIRECTION, NO_ID_LEVEL } from "../logic/constants.jsx";

import { useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";
import { LevelPlayContext } from "../context/LevelPlayContext.jsx";
import { MainQuestContext } from "../context/MainQuestContext.jsx";

import { useNavigate } from "react-router-dom";
import { mainQuestReducer } from "../context/mainQuestReducer.jsx";

export default function Component() {
  const editContext = useContext(LevelEditContext);
  const playContext = useContext(LevelPlayContext);
  const questContext = useContext(MainQuestContext);

  const navigate = useNavigate();

  function backToEdition() {
    editContext.dispatch({ type: "keepEditorState" });
    if (editContext.state.levelID === NO_ID_LEVEL) {
      navigate(paths.editLevelNew());
    } else {
      navigate(paths.editLevel(editContext.state.levelID));
    }
  }

  function backToFreePlay() {
    navigate(paths.levelListForFreePlay());
  }

  function backToMainQuest() {
    navigate(paths.levelListForMainQuest());
  }

  function toPreviousLevelMQ() {
    navigate(paths.playLevelQuest(questContext.state.number - 1));
  }

  function toNextLevelMQ() {
    navigate(paths.playLevelQuest(questContext.state.number + 1));
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

      {/* Nom du niveau (+ petite marge) */}

      <div>
        {(doIComeFromEditor()
          ? "Edition - "
          : amIInMainQuest()
            ? "Niveau " + questContext.state.number + " - "
            : "") + editContext.state.levelName}

        {/*+ amIInFreePlay ? " (Auteur : " + "" + ")" : ""} TODO*/}
      </div>

      {/* Changement de niveau */}

      {doIComeFromEditor() ? (
        <button onClick={() => backToEdition()}>Retour a l'edition</button>
      ) : amIInFreePlay() ? (
        <button onClick={() => backToFreePlay()}>
          Retour au choix du niveau
        </button>
      ) : amIInMainQuest() ? (
        <div>
          <button
            disabled={questContext.state.number === 1}
            onClick={() => toPreviousLevelMQ()}
          >
            Niveau précédent
          </button>
          <button onClick={() => backToMainQuest()}>
            Retour au choix du niveau
          </button>
          <button
            disabled={
              questContext.state.number === questContext.state.lastLevelNumber
            }
            onClick={() => toNextLevelMQ()}
          >
            Niveau suivant
          </button>
        </div>
      ) : (
        <button className="error">NE DEVRAIT PAS APPARAITRE</button>
      )}
    </div>
  );
}
