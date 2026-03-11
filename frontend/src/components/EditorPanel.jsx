import {
  SPACE,
  SPACE_INFO,
  BLOCK,
  BLOCK_INFO,
  DO_NOT_CHANGE,
} from "../logic/constants.jsx";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import * as saveLoad from "../logic/saveLoad";
import { paths } from "../index.js";

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
      </div>
      <div>
        <button
          className="buttonSelectionALight"
          onClick={() => selectSpace(SPACE.GOAL_A)}
        >
          Cible A
        </button>
        <button
          className="buttonSelectionBLight"
          onClick={() => selectSpace(SPACE.GOAL_B)}
        >
          Cible B
        </button>
        <button
          className="buttonSelectionCLight"
          onClick={() => selectSpace(SPACE.GOAL_C)}
        >
          Cible C
        </button>
        <button onClick={() => selectSpace(SPACE.EMPTY)}>Aucune cible</button>
      </div>
      <div>
        <button
          className="buttonSelectionA"
          onClick={() => selectBlock(BLOCK.A)}
        >
          Bloc A
        </button>
        <button
          className="buttonSelectionB"
          onClick={() => selectBlock(BLOCK.B)}
        >
          Bloc B
        </button>
        <button
          className="buttonSelectionC"
          onClick={() => selectBlock(BLOCK.C)}
        >
          Bloc C
        </button>
        <button onClick={() => selectBlock(BLOCK.NONE)}>Aucun bloc</button>
      </div>
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
          onClick={() => saveLoad.loadAndSaveALLLevels(state, dispatch)}
        >
          Charger et enregistrer TOUS les niveaux
        </button>
      </div>
    </div>
  );
}

export default EditorPanel;
