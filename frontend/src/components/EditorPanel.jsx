import {
  SPACE,
  SPACE_DISPLAY_INFO,
  BLOCK,
  BLOCK_DISPLAY_INFO,
  DO_NOT_CHANGE,
  BLOCK_FAMILIES,
} from "../logic/constants.jsx";
import { deleteLevel } from "../utils/api.jsx";
import { saveLevel, loadLevelForEditorWithData } from "../logic/saveLoad.jsx";

import { useAuth } from "../context/AuthContext.jsx";
import "../styles/style.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths.jsx";

export default function Component({ state, dispatch }) {
  function captionItemSelected(pSpace, pBlock) {
    //console.log("captionItemSelected : " + pSpace + pBlock); (great for debug)
    return (
      "case " +
      (pSpace !== DO_NOT_CHANGE
        ? SPACE_DISPLAY_INFO[pSpace].captionEditor
        : ".") +
      "/ bloc " +
      (pBlock !== DO_NOT_CHANGE
        ? BLOCK_DISPLAY_INFO[pBlock].captionEditor
        : ".")
    );
  }

  function selectSpace(pFixed) {
    dispatch({ type: "currentSpace", value: pFixed });
    if (pFixed === SPACE.WALL) {
      dispatch({ type: "currentBlock", value: BLOCK.NONE });
    } else {
      dispatch({ type: "currentBlock", value: DO_NOT_CHANGE });
    }
  }

  function selectBlock(pMobile) {
    if (state.currentSpace === SPACE.WALL) {
      dispatch({ type: "currentSpace", value: SPACE.EMPTY });
    } else {
      dispatch({ type: "currentSpace", value: DO_NOT_CHANGE });
    }
    dispatch({ type: "currentBlock", value: pMobile });
  }

  function emptySpace() {
    dispatch({ type: "currentSpace", value: SPACE.EMPTY });
    dispatch({ type: "currentBlock", value: BLOCK.NONE });
  }

  const navigate = useNavigate();
  function handleDeleteLevel() {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      deleteLevel(state.levelID)
        .then(() => {
          alert("Niveau correctement supprimé.");
          navigate(paths.levelListForEditor());
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la suppression du niveau");
        });
    }
  }

  function handleSaveLevel() {
    if (
      state.levelID === 0 ||
      window.confirm("Etes-vous certain de vouloir sauver ce niveau ?")
    ) {
      try {
        (async function () {
          await saveLevel(state, dispatch);
          alert("Niveau correctement sauvegardé.");
        })();
      } catch (error) {
        console.error(error);
        alert("Echec de la sauvegarde du niveau !");
      }
    }
  }

  function handlePlaytestLevel() {
    navigate(paths.editLevelPlaying());
  }

  function handleMovesChange(pBlockId, pValue) {
    dispatch({ type: "movesLimit", index: pBlockId, value: pValue });
  }

  function handleMovesSuperChange(pBlockId, pValue) {
    dispatch({ type: "movesSuperLimit", index: pBlockId, value: pValue });
    // Note : rien n'est fait si la super limite est supérieure à la limite ordinaire.
  }

  function handleInfiniteMovesChange(pBlockId, pValue) {
    dispatch({
      type: "movesInfinite",
      index: pBlockId,
      value: pValue,
    });
  }

  function handleLoadFromData() {
    try {
      loadLevelForEditorWithData(dataLevel, dispatch);
    } catch (error) {
      window.alert(
        "Impossible de charger le niveau ! Veuillez partir immédiatement ! \n\n" +
          error.message,
      );
    }
  }

  // =================================

  const { amIAnAdmin } = useAuth();
  const [dataLevel, setDataLevel] = useState("");

  return (
    <div className="mainComponent panel">
      <div>
        Actuellement sélectionné :{" "}
        {captionItemSelected(state.currentSpace, state.currentBlock)}
      </div>
      <div>
        <button onClick={() => selectSpace(SPACE.WALL)}>Mur</button>
        <button onClick={() => emptySpace()}>Case vide</button>
        <button onClick={() => selectSpace(SPACE.EMPTY)}>Aucune cible</button>
        <button onClick={() => selectBlock(BLOCK.NONE)}>Aucun bloc</button>
      </div>
      <div>
        {BLOCK_FAMILIES.map((family) => (
          <div key={family.id}>
            <button
              className={`buttonSelection${family.letter}Light`}
              onClick={() => selectSpace(family.target)}
            >
              Cible {family.letter}
            </button>
            Blocs :
            <button
              className={`buttonSelection${family.letter}`}
              onClick={() => selectBlock(family.normal)}
            >
              Normal {family.letter}
            </button>
            <button
              className={`buttonSelection${family.letter}`}
              onClick={() => selectBlock(family.steel)}
            >
              Acier {family.letter}
            </button>
            {"               "}
            <span className={"littleHelp"}>{"   "}Coups limites :</span>
            {"  "}
            <input
              className={`inputMoves ${family.letter}`}
              onChange={(e) => handleMovesChange(family.id, e.target.value)}
              disabled={
                state.movesInfinite[family.id] ? "disabled" : ""
              } /** Credits : https://stackoverflow.com/questions/36773671/deactivate-input-in-react-with-a-button-click */
              value={state.movesLimit[family.id]}
              min={0}
              max={99}
              type="number"
            ></input>
            {"     "}
            <span className={"littleHelp"}>Coups infinis : </span>
            <input
              type="checkbox"
              checked={state.movesInfinite[family.id]}
              onChange={(e) =>
                handleInfiniteMovesChange(family.id, e.target.checked)
              }
            />
            {"     "}
            <span className={"littleHelp"}>Super limite : </span>
            <input
              className={`inputMoves ${family.letter}`}
              min={0}
              max={999}
              type="number"
              value={state.movesSuperLimit[family.id]}
              onChange={(e) =>
                handleMovesSuperChange(family.id, e.target.value)
              }
            />
          </div>
        ))}
      </div>
      <br></br>
      <div>
        <input
          onChange={(e) =>
            dispatch({ type: "levelName", levelName: e.target.value })
          } // Credits : https://stackoverflow.com/questions/68473280/how-to-do-onchange-with-react-numeric-input
          value={state.levelName}
        />
        <button onClick={() => handleSaveLevel()}>Sauver niveau</button>
        {state.levelID > 0 && (
          <button className="delete" onClick={() => handleDeleteLevel()}>
            Effacer niveau
          </button>
        )}
      </div>
      <div>
        <button onClick={() => handlePlaytestLevel()}>Tester niveau</button>
      </div>
      {amIAnAdmin() && (
        <div>
          Charger un niveau d'après ses données{" "}
          <input
            type="text"
            onChange={(e) => setDataLevel(e.target.value)}
          ></input>
          <button onClick={() => handleLoadFromData()}>Charger</button>
        </div>
      )}
    </div>
  );
}
