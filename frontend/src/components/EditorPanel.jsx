import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";

function EditorPanel({ editorState, updateEditorState, loadingPackage }) {
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

  function loadLevel() {
    loadingPackage.setIdLevel(3 - loadingPackage.idLevel);
  }

  function saveLevel() {
    window.alert("En cours de création...");
  }

  // ---------------------------------

  function selectSpace(pFixed) {
    updateEditorState((prev) => ({
      ...prev,
      currentSpace: pFixed,
      currentBlock: -1,
    }));
  }

  function selectBlock(pMobile) {
    updateEditorState((prev) => ({
      ...prev,
      currentSpace: SPACE.EMPTY,
      currentBlock: pMobile,
    }));
  }

  // =================================

  return (
    <div>
      <div>
        Actuellement sélectionné : {editorState.currentSpace}{" "}
        {editorState.currentBlock}
        {"     "}
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
        <button onClick={() => loadLevel("http://127.0.0.1:8000/api/level/")}>
          Charger niveau
        </button>
        <button className="buttonSelectionC" onClick={() => saveLevel()}>
          Sauver niveau
        </button>
      </div>
    </div>
  );
}

export default EditorPanel;
