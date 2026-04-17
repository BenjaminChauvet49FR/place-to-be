import {
  SPACE,
  SPACE_INFO,
  BLOCK,
  BLOCK_INFO,
  DO_NOT_CHANGE,
  BLOCK_TYPES_LIST,
} from "../logic/constants.jsx";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import * as saveLoad from "../logic/saveLoad";
import { paths } from "../utils/paths.jsx";
import { loadAndSaveALLLevels } from "../logic/encodingBascule.jsx";

function EditorPanel({ state, dispatch }) {
  function captionItemSelected(pSpace, pBlock) {
    //console.log("captionItemSelected : " + pSpace + pBlock); (great for debug)
    return (
      "case " +
      (pSpace !== DO_NOT_CHANGE ? SPACE_INFO[pSpace].captionEditor : ".") +
      "/ bloc " +
      (pBlock !== DO_NOT_CHANGE ? BLOCK_INFO[pBlock].captionEditor : ".")
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
  function deleteLevel() {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      saveLoad
        .deleteLevel(state.levelID)
        .then(() => {
          alert("Niveau correctement supprimé.");
          navigate(paths.levelList());
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la suppression du niveau");
        });
    }
  }

  function saveLevel() {
    if (
      state.levelID === 0 ||
      window.confirm("Etes-vous certain de vouloir sauver ce niveau ?")
    ) {
      saveLoad
        .saveLevel(state, dispatch)
        .then(() => {
          alert("Niveau correctement sauvegardé.");
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la sauvegarde du niveau !");
        });
    }
  }

  function playtestLevel() {
    navigate(paths.playing());
  }

  function handleMovesChange(pBlockId, pValue) {
    dispatch({ type: "movesLimit", index: pBlockId, value: pValue });
  }

  function handleInfiniteMovesChange(pBlockId, pValue) {
    dispatch({
      type: "movesInfinite",
      index: pBlockId,
      value: pValue,
    });
  }

  // =================================

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
        {BLOCK_TYPES_LIST.map((type) => (
          <div key={type.cn}>
            <button
              className={`buttonSelection${type.cn}Light`}
              onClick={() => selectSpace(type.goal)}
            >
              Cible {type.goal}
            </button>
            <button
              className={`buttonSelection${type.cn}`}
              onClick={() => selectBlock(type.block)}
            >
              Bloc {type.block}
            </button>
            {"               "}
            <span className={"littleHelp"}>{"   "}Coups limites :</span>
            {"  "}
            <input
              className={`inputMoves ${type.cn}`}
              onChange={(e) => handleMovesChange(type.id, e.target.value)}
              disabled={
                state.movesInfinite[type.id] ? "disabled" : ""
              } /** Credits : https://stackoverflow.com/questions/36773671/deactivate-input-in-react-with-a-button-click */
              value={state.movesLimit[type.id]}
              min={0}
              max={99}
              type="number"
            ></input>
            {"     "}
            <span className={"littleHelp"}>Coups infinis : </span>
            <input
              type="checkbox"
              checked={state.movesInfinite[type.id]}
              onChange={(e) =>
                handleInfiniteMovesChange(type.id, e.target.checked)
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
        <button onClick={() => saveLevel()}>Sauver niveau</button>
        <button className="delete" onClick={() => deleteLevel()}>
          Effacer niveau
        </button>
      </div>
      <div>
        <button onClick={() => playtestLevel()}>Tester niveau</button>
      </div>
      <div>
        <button
          className="danger"
          onClick={() => loadAndSaveALLLevels(state, dispatch)}
        >
          Charger et enregistrer TOUS les niveaux
        </button>
      </div>
    </div>
  );
}

export default EditorPanel;
