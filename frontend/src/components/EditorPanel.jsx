import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";
import NumericInput from "react-numeric-input";
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

  function loadLevel() {
    loadingPackage.setIdLevel(fieldIDLevel);
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

  const [fieldIDLevel, setFieldIDLevel] = useState(1);

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
        <NumericInput
          min={1}
          max={100}
          onChange={(e) => setFieldIDLevel(e)} // Credits : https://stackoverflow.com/questions/68473280/how-to-do-onchange-with-react-numeric-input
          value={fieldIDLevel}
        />
        <button onClick={() => loadLevel(fieldIDLevel)}>Charger niveau</button>
        <button
          onClick={() =>
            saveLevel({
              gridM: loadingPackage.gridM,
              gridF: loadingPackage.gridF,
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
