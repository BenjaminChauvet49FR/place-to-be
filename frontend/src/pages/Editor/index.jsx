import { SPACE, REAL_XLENGTH, REAL_YLENGTH } from "../../logic/constants";
import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState, useEffect, useRef } from "react";
import { loadLevelForEditor } from "../../logic/saveLoad";
import { useParams } from "react-router-dom";

import { useReducer } from "react";
import { reducer } from "../../logic/reducers.jsx";

// -----------------------

function dummyEditorGridF() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      field[y].push(SPACE.EMPTY);
    }
  }
  for (let i = 0; i < REAL_YLENGTH; i++) {
    field[i][0] = SPACE.WALL;
    field[i][REAL_XLENGTH - 1] = SPACE.WALL;
  }
  for (let i = 0; i < REAL_XLENGTH; i++) {
    field[0][i] = SPACE.WALL;
    field[REAL_YLENGTH - 1][i] = SPACE.WALL;
  }
  return field;
}

function dummyEditorGridM() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      // TODO change these hard-coded values !
      field[y].push(-1); // TODO change -1s everywhere !
    }
  }
  return field;
}

export default function Editor() {
  const { levelId } = useParams(); // Remember : same name as in router mandatory, or else... undefined !

  const [loadedData, setLoadedData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    gridF: dummyEditorGridF(),
    gridM: dummyEditorGridM(),
    levelID: parseInt(levelId),
    levelName: "",
    currentSpace: SPACE.EMPTY,
    currentBlock: -1,
  });

  const loadingPackage = {
    loadedData: loadedData,
    setLoadedData: setLoadedData,
    isLoading: isLoading,
    setLoading: setLoading,
    loadingError: loadingError,
    setLoadingError: setLoadingError,
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    //if (hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);

    if (state.levelID > 0) {
      // TODO il y a mieux à faire, non ?
      fetch(`http://localhost:8000/api/level/${state.levelID}`).then(
        (response) =>
          response
            .json()
            .then((levelData) => {
              loadLevelForEditor(levelData.data, levelData.name, dispatch);
            })
            .catch((error) => {
              console.log(error);
              window.alert(
                "Impossible de charger le niveau d'id " + state.levelID,
              );
            })
            .finally(setLoading(false)),
      );
    } else {
      loadLevelForEditor("", "", dispatch);
      setLoading(false);
    }
  }, [state.levelID]);

  return (
    <div>
      <EditorField
        state={state}
        dispatch={dispatch}
        loadingPackage={loadingPackage}
      ></EditorField>
      <EditorPanel
        state={state}
        dispatch={dispatch}
        loadingPackage={loadingPackage}
      ></EditorPanel>
    </div>
  );
}
