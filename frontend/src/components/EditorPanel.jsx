import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";
import { useState } from "react";
import { saveLevel } from "../logic/saveLoad";

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

  const [fieldNameLevel, setFieldNameLevel] = useState("Mon niveau");

  return (
    <div className="mainComponent panel">
      <div>
        Actuellement sélectionné : {editorState.currentSpace}{" "}
        {editorState.currentBlock}
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
          onChange={(e) => setFieldNameLevel(e.target.value)} // Credits : https://stackoverflow.com/questions/68473280/how-to-do-onchange-with-react-numeric-input
          value={fieldNameLevel}
        />
        <button
          onClick={() =>
            saveLevel({
              gridM: loadingPackage.gridM,
              gridF: loadingPackage.gridF,
              name: fieldNameLevel,
              id: loadingPackage.idLevel,
              setId: loadingPackage.setIdLevel,
            })
          }
        >
          Sauver niveau
        </button>
      </div>
    </div>
  );
}

export default EditorPanel;
