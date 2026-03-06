import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";
import { useState } from "react";
import { saveLevel } from "../logic/saveLoad";

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

  function selectSpace(pFixed) {
    dispatch({ type: "currentSpace", value: pFixed });
  }

  function selectBlock(pMobile) {
    dispatch({ type: "currentBlock", value: pMobile });
  }

  // =================================

  return (
    <div className="mainComponent panel">
      <div>
        Actuellement sélectionné : {state.currentSpace} {state.currentBlock}
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
        <button onClick={() => saveLevel(state, dispatch)}>
          Sauver niveau
        </button>
      </div>
    </div>
  );
}

export default EditorPanel;
