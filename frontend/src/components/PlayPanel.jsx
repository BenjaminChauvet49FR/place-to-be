import { useGameplay } from "../logic/gameplay.jsx";
import {
  paths,
  doIComeFromEditor,
  amIInFreePlay,
  amIInMainQuest,
} from "../utils/paths.jsx";

import { DIRECTION, NO_ID_LEVEL, CLEAR } from "../logic/constants.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import { attestLevelSuccess } from "../utils/api.jsx";

import { useState, useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";
import { MainQuestContext } from "../context/MainQuestContext.jsx";

import { useNavigate } from "react-router-dom";

export default function Component() {
  const editContext = useContext(LevelEditContext);
  const questContext = useContext(MainQuestContext);

  const navigate = useNavigate();

  function backToEdition() {
    if (editContext.state.levelID === NO_ID_LEVEL) {
      navigate(paths.editLevelNew(), { state: { comeFromPlayTest: true } });
    } else {
      navigate(paths.editLevel(editContext.state.levelID), {
        state: { comeFromPlayTest: true },
      });
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
    restart,
    getBlockTypes,
    getCurrentBlockType,
    getMovesPlayed,
    getMovesLimit,
    areMovesInfinite,
    setCurrentBlockType,
    checkClearConditions,
  } = useGameplay();

  const { user } = useAuth();

  const [clearState, setClearState] = useState(CLEAR.NO);

  function handleMoveBlocks(pDirection) {
    let movePerformed = moveBlocks(pDirection);
    if (movePerformed) {
      // Fait un peu tôt MAIS le fait que "l'attente" (un window.alert ou un message d'API) soit juste avant le tout dernier déplacement n'est pas idiot en soi. Ca va me rappeler l'heurese époque de Django ;)

      let newClearState = checkClearConditions();
      if (clearState < newClearState) {
        setClearState(newClearState);
        let winningMessage = "";

        if (newClearState === CLEAR.PARTIAL) {
          winningMessage = "Niveau réussi partiellement";
        }
        if (newClearState === CLEAR.TOTAL) {
          winningMessage = "Niveau réussi totalement :)";
        }
        if (!doIComeFromEditor() && user) {
          attestLevelSuccess(editContext.state.levelID, newClearState);
        } else {
          winningMessage += " (non enregistré)";
        }
        window.alert(winningMessage);
      }
    }
  }

  return (
    <div className="panel mainComponent">
      {/* Les directions */}

      <div className="mainMovesPanel">
        <div className="directionsPanel">
          <div>
            <button onClick={() => handleMoveBlocks(DIRECTION.U)}>Haut</button>
          </div>
          <div>
            <button onClick={() => handleMoveBlocks(DIRECTION.L)}>
              Gauche
            </button>
            <button onClick={() => handleMoveBlocks(DIRECTION.R)}>
              Droite
            </button>
          </div>
          <div>
            <button onClick={() => handleMoveBlocks(DIRECTION.D)}>Bas</button>
          </div>
        </div>
        <button onClick={() => undo()}>Annuler</button>
        <button onClick={() => restart()}>Recommencer</button>

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

      {user && user.permissions.includes("authentication.cheat_level") && (
        <div>
          <button
            className="danger"
            onClick={() => {
              /*TODO */
            }}
          >
            Tricher
          </button>
        </div>
      )}
    </div>
  );
}
