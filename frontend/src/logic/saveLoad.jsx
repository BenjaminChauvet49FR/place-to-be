import {
  SPACE,
  BLOCK,
  REAL_XLENGTH,
  REAL_YLENGTH,
  NO_ID_LEVEL,
} from "./constants.jsx";

export function loadLevelForEditor(pLevelData, pName, pDispatch) {
  let x, y;
  let gridF = [];
  let gridM = [];
  let countData = 0;
  let spaceF, spaceM;
  for (y = 0; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    for (x = 0; x < REAL_XLENGTH; x++) {
      if (
        y === 0 ||
        y === REAL_YLENGTH - 1 ||
        x === 0 ||
        x === REAL_XLENGTH - 1
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
  pDispatch({ type: "gridF_ALL", gridF: gridF });
  pDispatch({ type: "gridM_ALL", gridM: gridM });
  pDispatch({ type: "levelName", levelName: pName });
}

export function saveLevel(pState, pDispatch) {
  // Note : here, pState is read but not written... except for ID.
  const gridM = pState.gridM;
  const gridF = pState.gridF;
  const name = pState.levelName;
  const id = pState.levelID;

  let x, y;
  let data = "";
  let char = "";
  for (y = 1; y < REAL_YLENGTH - 1; y++) {
    for (x = 1; x < REAL_XLENGTH - 1; x++) {
      switch (gridF[y][x]) {
        case SPACE.WALL:
          char = SPACE.WALL;
          break;
        case SPACE.EMPTY:
          switch (gridM[y][x]) {
            case BLOCK.A:
              char = BLOCK.A;
              break;
            case BLOCK.B:
              char = BLOCK.B;
              break;
            case BLOCK.C:
              char = BLOCK.C;
              break;
            default:
              char = SPACE.EMPTY;
              break;
          }
          break;
        default:
          return 1 / 0;
      }
      data += char;
    }
  }

  if (id === NO_ID_LEVEL) {
    fetch("http://localhost:8000/api/level/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"data": "' + data + '", "name": "' + name + '"}',
    })
      .then((response) =>
        response.json().then((levelData) => {
          pDispatch({ type: "levelID", levelID: levelData.id });
          window.alert("Niveau correctement sauvegardé !");
        }),
      )
      .catch((error) => {
        window.alert("Echec dans l'enregistrement du niveau !");
      });
  } else {
    fetch("http://localhost:8000/api/level/" + id + "/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: '{"data": "' + data + '", "name": "' + name + '"}',
    })
      .then((response) =>
        response.json().then((levelData) => {
          window.alert("Niveau correctement sauvegardé !");
        }),
      )
      .catch((error) => {
        window.alert("Echec dans l'enregistrement du niveau !");
      });
  }
}
