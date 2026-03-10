import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import * as saveLoad from "../logic/saveLoad";

function captionItemSelected(pSpace, pBlock) {
  if (pSpace === SPACE.EMPTY) {
    if (pBlock === BLOCK.NONE) {
      return "Case vide";
    }
    if (pBlock === BLOCK.A) {
      return "Bloc A";
    }
    if (pBlock === BLOCK.B) {
      return "Bloc B";
    }
    if (pBlock === BLOCK.C) {
      return "Bloc C";
    }
  }
  if (pSpace === SPACE.WALL && pBlock === BLOCK.NONE) {
    return "Mur";
  }
  window.alert("Attention, erreur d'item selectionne !");
  return 1 / 0;
}

function EditorPanel({ state, dispatch }) {
  // =================================

  // =================================

  /*function loadLevel(pURL) {
    if (!pURL) return;

    loadingPackage.setLoading(true);

    async function fetchData() {
      try {
        const response = await fetch(pURL);

        const data = await response.json();

        loadingPackage.setLoadedData(data);
      } catch (err) {
        console.log(err);

        loadingPackage.setLoadingError(true);
      } finally {
        loadingPackage.setLoading(false);
      }
    }

    fetchData();
    if (!loadingPackage.loadingError) {
      window.alert("Chargement réussi !");
    } else {
      window.alert("Echec du chargement !");
    }
  }*/

  // ---------------------------------

  const navigate = useNavigate();

  function selectSpace(pFixed) {
    dispatch({ type: "currentSpace", value: pFixed });
    dispatch({ type: "currentBlock", value: BLOCK.NONE });
  }

  function selectBlock(pMobile) {
    dispatch({ type: "currentSpace", value: SPACE.EMPTY });
    dispatch({ type: "currentBlock", value: pMobile });
  }

  function deleteLevel() {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      saveLoad
        .deleteLevel(state.levelID)
        .then(() => {
          alert("Niveau correctement supprimé.");
          navigate("/editor");
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
    navigate("/editLevel/playing");
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
        <button onClick={() => selectSpace(SPACE.EMPTY)}>Case vide</button>
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
    </div>
  );
}

export default EditorPanel;
