import {
  SPACE,
  BLOCK,
  REAL_XLENGTH,
  REAL_YLENGTH,
} from "../../logic/constants";
import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState, useEffect, useRef } from "react";

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

export default function EditPage() {
  const [loadedData, setLoadedData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  const [idLevel, setIdLevel] = useState(1);
  const loadingPackage = {
    loadedData: loadedData,
    setLoadedData: setLoadedData,
    isLoading: isLoading,
    setLoading: setLoading,
    loadingError: loadingError,
    setLoadingError: setLoadingError,
    idLevel: idLevel,
    setIdLevel: setIdLevel,
  };

  const [editorState, updateEditorState] = useState({
    currentSpace: SPACE.EMPTY,
    currentBlock: -1,
  });
  const [gridF, updateGridF] = useState(dummyEditorGridF());
  const [gridM, updateGridM] = useState(dummyEditorGridM());
  const hasFetched = useRef(false);

  function loadLevelForEditor(pLevelData) {
    let x, y;
    let gridF = [];
    let gridM = [];
    let countData = 0;
    let spaceF, spaceM;
    for (y = 0; y < REAL_XLENGTH; y++) {
      gridF.push([]);
      gridM.push([]);
      for (x = 0; x < REAL_XLENGTH; x++) {
        if (
          y == 0 ||
          y == REAL_YLENGTH - 1 ||
          x == 0 ||
          x == REAL_XLENGTH - 1
        ) {
          spaceF = SPACE.WALL;
          spaceM = BLOCK.NONE;
        } else {
          if (countData < pLevelData.length) {
            switch (pLevelData.charAt(countData)) {
              case "1":
                spaceF = SPACE.WALL;
                spaceM = SPACE.NONE;
                break;
              case "0":
                spaceF = SPACE.EMPTY;
                spaceM = BLOCK.NONE;
                break;
              case "A":
                spaceF = SPACE.EMPTY;
                spaceM = BLOCK.A;
                break;
              case "B":
                spaceF = SPACE.EMPTY;
                spaceM = BLOCK.B;
                break;
              case "C":
                spaceF = SPACE.EMPTY;
                spaceM = BLOCK.C;
                break;
              default:
                return 1 / 0;
            }
            countData++;
          } else {
            spaceF = SPACE.EMPTY;
            spaceM = BLOCK.NONE;
          }
        }
        gridF[y].push(spaceF);
        gridM[y].push(spaceM);
      }
    }
    updateGridF(gridF);
    updateGridM(gridM);
  }

  useEffect(() => {
    //if (hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);

    fetch(`http://localhost:8000/api/level/${idLevel}`).then((response) =>
      response
        .json()
        .then((levelData) => {
          loadLevelForEditor(levelData.data);
        })
        .catch((error) => {
          console.log(error);
          window.alert("Impossible de charger le niveau d'id " + idLevel);
        })
        .finally(setLoading(false)),
    );
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
