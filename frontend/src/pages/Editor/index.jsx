import { SPACE, REAL_XLENGTH, REAL_YLENGTH } from "../../logic/constants";
import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState, useEffect, useRef } from "react";
import { loadLevelForEditor } from "../../logic/saveLoad";
import { useParams } from "react-router-dom";

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
  const { levelId } = useParams();

  const [loadedData, setLoadedData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [idLevel, setIdLevel] = useState(parseInt(levelId));
  const [gridF, updateGridF] = useState(dummyEditorGridF());
  const [gridM, updateGridM] = useState(dummyEditorGridM());
  const loadingPackage = {
    loadedData: loadedData,
    setLoadedData: setLoadedData,
    isLoading: isLoading,
    setLoading: setLoading,
    loadingError: loadingError,
    setLoadingError: setLoadingError,
    idLevel: idLevel,
    setIdLevel: setIdLevel,
    gridF: gridF,
    updateGridF: updateGridF,
    gridM: gridM,
    updateGridM: updateGridM,
  };

  const [editorState, updateEditorState] = useState({
    currentSpace: SPACE.EMPTY,
    currentBlock: -1,
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    //if (hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);

    if (idLevel > 0) {
      // TODO il y a mieux à faire !
      fetch(`http://localhost:8000/api/level/${idLevel}`).then((response) =>
        response
          .json()
          .then((levelData) => {
            loadLevelForEditor(levelData.data, {
              updateGridF: updateGridF,
              updateGridM: updateGridM,
            });
          })
          .catch((error) => {
            console.log(error);
            window.alert("Impossible de charger le niveau d'id " + idLevel);
          })
          .finally(setLoading(false)),
      );
    } else {
      loadLevelForEditor("", {
        updateGridF: updateGridF,
        updateGridM: updateGridM,
      });
      setLoading(false);
    }
  }, [idLevel]);

  return (
    <div>
      <EditorField
        gridF={gridF}
        updateGridF={updateGridF}
        gridM={gridM}
        updateGridM={updateGridM}
        editorState={editorState}
        loadingPackage={loadingPackage}
      ></EditorField>
      <EditorPanel
        editorState={editorState}
        updateEditorState={updateEditorState}
        loadingPackage={loadingPackage}
      ></EditorPanel>
    </div>
  );
}
