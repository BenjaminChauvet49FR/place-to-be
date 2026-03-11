import {
  SPACE,
  BLOCK,
  REAL_XLENGTH,
  REAL_YLENGTH,
  NO_ID_LEVEL,
  encodedBlockToBlock,
  blockToEncodedBlock,
  isBlock,
  isEncodedBlock,
} from "./constants.jsx";

export function loadNewLevel(pDispatch) {
  loadLevelForEditor("99991", "", pDispatch);
}

export function loadLevel(pID, pDispatch) {
  fetch(`http://localhost:8000/api/level/${pID}`).then((response) =>
    response
      .json()
      .then((levelData) => {
        loadLevelForEditor(levelData.data, levelData.name, pDispatch);
      })
      .catch((error) => {
        console.log(error);
        window.alert("Impossible de charger le niveau d'id " + pID);
      }),
  );
}

// Note : I put this in place as it will be useful whenever I decide to change the encoding system.
// Once the "new loading system" is deemed stable, I rename it into "old system" and leave the "new system" empty.
// That's the best I had found. (after all, changing encoding already requires me to write into this file)
function loadLevelForEditor(pLevelData, pName, pDispatch) {
  let pReturnedGrids;
  if (pName.startsWith("TEST_ENCODING_PURPOSE_ONLY")) {
    pReturnedGrids = loadLevelForEditorNewSystem(pLevelData);
  } else {
    pReturnedGrids = loadLevelForEditorPreviousSystem(pLevelData);
  }
  pDispatch({ type: "gridF_ALL", gridF: pReturnedGrids.gridF });
  pDispatch({ type: "gridM_ALL", gridM: pReturnedGrids.gridM });
  pDispatch({ type: "levelName", levelName: pName });
}

const MASTER_STRING =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&$";

function valToChar(pVal) {
  return MASTER_STRING.charAt(pVal);
}

function charToVal(pChar) {
  return MASTER_STRING.indexOf(pChar);
}

function loadLevelForEditorPreviousSystem(pLevelData) {
  let x, y;
  let gridF = [];
  let gridM = [];
  let xFirst = charToVal(pLevelData.charAt(0));
  let yFirst = charToVal(pLevelData.charAt(1));
  let xLast = charToVal(pLevelData.charAt(2));
  let yLast = charToVal(pLevelData.charAt(3));

  for (y = 0; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    for (x = 0; x < REAL_XLENGTH; x++) {
      gridF[y].push(
        x === 0 || x === REAL_XLENGTH - 1 || y === 0 || y === REAL_YLENGTH - 1
          ? SPACE.WALL
          : SPACE.EMPTY,
      );
      gridM[y].push(BLOCK.NONE);
    }
  }

  let levelSize = (yLast - yFirst + 1) * (xLast - xFirst + 1);
  let dataMain = pLevelData.substring(4, 4 + levelSize);
  let dataBelowItems = pLevelData.substring(4 + levelSize);

  let iData = 0;
  let iDataBelow = 0;
  let char;

  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      char = dataMain.charAt(iData);
      if (isEncodedBlock(char)) {
        gridF[y][x] = dataBelowItems.charAt(iDataBelow);
        gridM[y][x] = encodedBlockToBlock(char);
        iDataBelow++;
      } else {
        gridF[y][x] = char;
        gridM[y][x] = BLOCK.NONE;
      }
      iData++;
    }
  }

  // Don't forget the "return" !
  return {
    gridF: gridF,
    gridM: gridM,
  };
}

function loadLevelForEditorNewSystem(pLevelData) {
  return loadLevelForEditorPreviousSystem(pLevelData);
}

function encodedLevelData(pGridF, pGridM) {
  // Note : here, pState is read but not written... except for ID.

  let x, y;
  let xFirst = 99;
  let yFirst = 99;
  let xLast = -1;
  let yLast = -1;

  // Scanning the topleft and bottomright squares
  for (y = 1; y < REAL_YLENGTH - 1; y++) {
    for (x = 1; x < REAL_XLENGTH - 1; x++) {
      if (pGridF[y][x] !== SPACE.EMPTY) {
        xFirst = Math.min(xFirst, x);
        yFirst = Math.min(yFirst, y);
        xLast = Math.max(xLast, x);
        yLast = Math.max(yLast, y);
      }
    }
  }
  // TODO WARNING ! Potential bug, if someone decides to let the lines on top/bottom/left/right completely blank !

  let dataSize =
    valToChar(xFirst) + valToChar(yFirst) + valToChar(xLast) + valToChar(yLast);

  let dataBelowItems = "";
  let dataMain = "";
  let char = "";
  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      if (isBlock(pGridM[y][x])) {
        char = blockToEncodedBlock(pGridM[y][x]);
        dataBelowItems += pGridF[y][x];
      } else {
        char = pGridF[y][x];
      }
      dataMain += char;
    }
  }
  return dataSize + dataMain + dataBelowItems;
}

export function saveLevel(pState, pDispatch) {
  const data = encodedLevelData(pState.gridF, pState.gridM);
  const name = pState.levelName;
  const id = pState.levelID;

  if (id === NO_ID_LEVEL) {
    return fetch("http://localhost:8000/api/level/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data,
        name: name,
      }),
    })
      .then(async (response) =>
        response.json().then((levelData) => {
          pDispatch({ type: "levelID", levelID: levelData.id });
        }),
      )
      .catch((error) => {
        window.alert("Echec dans l'enregistrement du niveau !");
      });
  } else {
    return fetch("http://localhost:8000/api/level/" + id + "/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: data,
        name: name,
      }),
    })
      .then(async (response) => response.json().then((levelData) => {}))
      .catch((error) => {
        window.alert("Echec dans l'enregistrement du niveau !");
      });
  }
}

export async function deleteLevel(id) {
  const response = await fetch(`http://localhost:8000/api/level/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer le niveau");
  }
}

// Transfer ALL levels from the previous encoding system to the new one ! (by loading all systems and resaving them)
// Use with care !
async function loadAllLevels() {
  const response = await fetch(`http://localhost:8000/api/level/`); // TODO : ce serait bien d'avoir un point d'entrée qui ne renvoie QUE les ID.
  if (!response.ok) {
    throw new Error("Impossible de récupérer la liste des niveaux !");
  }
  return response.json();
}
export function loadAndSaveALLLevels(pState, pDispatch) {
  loadAllLevels()
    .then((JSONResponse) => {
      console.log(JSONResponse);
      if (
        window.confirm(
          "Vous êtes sur le point de charger puis sauvegarder TOUS les niveaux ! (au nombre de " +
            JSONResponse.length +
            ") : confirmer ?",
        )
      ) {
        JSONResponse.forEach((entry) => {
          loadLevel(entry.id, pDispatch);
          saveLevel(pState, pDispatch);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
