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
  BLOCK_INFO,
  NEW_ARRAY_MOVES_LIMIT,
  NEW_ARRAY_MOVES_INFINITE,
} from "./constants.jsx";

import { useNavigate } from "react-router-dom";
import { paths } from "../index.js";

import { API_URL } from "../utils/api.jsx";
import Error404 from "./Errors.js";

export function loadNewLevel(pDispatch) {
  loadLevelForEditor("99991", "", pDispatch);
}

export async function loadLevelFromID_CONNECTED(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, false);
}

export async function loadLevelFromID_FREE(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, true);
}

async function loadLevelFromID_aux(pID, pDispatch, pFree) {
  let headers = {};
  let url = `${API_URL}/api/levels/${pID}`;
  if (!pFree) {
    headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    url = `${API_URL}/api/level/${pID}`;
  }
  await fetch(url, { headers: headers })
    .then((response) => {
      if (response.status === 404) {
        console.log("Niveau non trouvé ! (ou non accessible)");
        throw new Error404();
      }
      return response.json();
    })
    .then((levelData) => {
      try {
        loadLevelForEditor(levelData.data, levelData.name, pDispatch);
      } catch (error) {
        console.log(error);
        window.alert("Impossible de charger le niveau d'id " + pID);
        throw error;
      }
    });
}

// Note : I put this in place as it will be useful whenever I decide to change the encoding system.
// Once the "new loading system" is deemed stable, I rename it into "old system" and leave the "new system" empty.
// That's the best I had found. (after all, changing encoding already requires me to write into this file)
function loadLevelForEditor(pLevelData, pName, pDispatch) {
  let loadedData;
  if (pName.startsWith("TEST_ENCODING_PURPOSE_ONLY")) {
    loadedData = loadLevelForEditorNewSystem(pLevelData);
  } else {
    loadedData = loadLevelForEditorPreviousSystem(pLevelData);
  }
  pDispatch({ type: "gridF_ALL", gridF: loadedData.gridF });
  pDispatch({ type: "gridM_ALL", gridM: loadedData.gridM });
  pDispatch({
    type: "movesInfinite_ALL",
    movesInfinite: loadedData.movesInfinite,
  });
  pDispatch({ type: "movesLimit_ALL", movesLimit: loadedData.movesLimit });

  pDispatch({ type: "levelName", levelName: pName });
}

// Note : we assume all parameters passed are fine in the use of enconding and decoding functions
const MASTER_STRING =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&$";
const INFINITE_SYMBOL = "-";
const EXTENSION_MARK = "+";
const NUMBER_THAT_MEANS_INFINITE = -1;

/** For numbers 0 to 63 */
function valToChar(pVal) {
  return MASTER_STRING.charAt(pVal);
}

function charToVal(pChar) {
  return MASTER_STRING.indexOf(pChar);
}

/** For numbers 0 to 127 */
function val127ToString(pVal) {
  if (pVal >= 64) {
    return EXTENSION_MARK + valToChar(pVal - 64);
  } else {
    return valToChar(pVal);
  }
}

// pDecoder = item with a property "index"
// pDecoder = {index : 0}
// successive uses of stringToVal127("36+5", pDecoder) returns 3 (for "3"), 6 (for "6") and 69 (for "+5")
function stringToVal127OrInfinite(pString, pDecoder) {
  if (pString.charAt(pDecoder.index) === EXTENSION_MARK) {
    pDecoder.index += 2;
    return 64 + charToVal(pString.charAt(pDecoder.index - 1));
  } else if (pString.charAt(pDecoder.index) === INFINITE_SYMBOL) {
    pDecoder.index++;
    return NUMBER_THAT_MEANS_INFINITE;
  } else {
    pDecoder.index++;
    return charToVal(pString.charAt(pDecoder.index - 1));
  }
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
    movesInfinite: NEW_ARRAY_MOVES_INFINITE(),
    movesLimit: NEW_ARRAY_MOVES_LIMIT(),
  };
}

function loadLevelForEditorNewSystem(pLevelData) {
  //return loadLevelForEditorPreviousSystem(pLevelData);
  let x, y;
  let gridF = [];
  let gridM = [];
  let xFirst = charToVal(pLevelData.charAt(0));
  let yFirst = charToVal(pLevelData.charAt(1));
  let xLast = charToVal(pLevelData.charAt(2));
  let yLast = charToVal(pLevelData.charAt(3));
  let movesInfinite = NEW_ARRAY_MOVES_INFINITE();
  let movesLimit = NEW_ARRAY_MOVES_LIMIT();

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
  let dataPostGrid = pLevelData.substring(4 + levelSize);

  let iData = 0;
  let iDataBelow = 0;
  let char;
  let blockTypesMet = [];

  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      char = dataMain.charAt(iData);
      if (isEncodedBlock(char)) {
        gridF[y][x] = dataPostGrid.charAt(iDataBelow);
        gridM[y][x] = encodedBlockToBlock(char);
        if (blockTypesMet.indexOf(gridM[y][x]) === -1) {
          blockTypesMet.push(gridM[y][x]);
        }
        iDataBelow++;
      } else {
        gridF[y][x] = char;
        gridM[y][x] = BLOCK.NONE;
      }
      iData++;
    }
  }
  // Now, all the data "below items" should be clear, and we are set to iDataBelow. Let's cut the string !
  dataPostGrid = dataPostGrid.substring(iDataBelow);
  let decoder = { index: 0 };
  let blockTypeMetIndex = 0;
  let value;
  let idBlock;
  while (decoder.index < dataPostGrid.length) {
    value = stringToVal127OrInfinite(dataPostGrid, decoder); // Decoder goes up by 1 or 2...
    idBlock = BLOCK_INFO[blockTypesMet[blockTypeMetIndex]].id;
    blockTypeMetIndex++; // ... and blockTypeMetIndex by 1.
    movesInfinite[idBlock] = value === NUMBER_THAT_MEANS_INFINITE;
    if (!movesInfinite[idBlock]) {
      movesLimit[idBlock] = value;
    }
  }

  // Don't forget the "return" !
  return {
    gridF: gridF,
    gridM: gridM,
    movesInfinite: movesInfinite,
    movesLimit: movesLimit,
  };
}

function encodedLevelData(pGridF, pGridM, pMovesInfinite, pMovesLimit) {
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
  let dataMovesPerColour = "";
  let seenColours = []; // Ordre des couleurs par >>> premier bloc rencontré <<< en lisant la grille en par ordre de lecture
  let id;
  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      if (isBlock(pGridM[y][x])) {
        char = blockToEncodedBlock(pGridM[y][x]);
        dataBelowItems += pGridF[y][x];
        if (seenColours.indexOf(pGridM[y][x]) === -1) {
          seenColours.push(pGridM[y][x]);
          id = BLOCK_INFO[pGridM[y][x]].id;
          if (pMovesInfinite[id]) {
            dataMovesPerColour += INFINITE_SYMBOL;
          } else {
            dataMovesPerColour += val127ToString(pMovesLimit[id]);
          }
        }
      } else {
        char = pGridF[y][x];
      }
      dataMain += char;
    }
  }
  return dataSize + dataMain + dataBelowItems + dataMovesPerColour;
}

export function saveLevel(pState, pDispatch) {
  const data = encodedLevelData(
    pState.gridF,
    pState.gridM,
    pState.movesInfinite,
    pState.movesLimit,
  );
  const name = pState.levelName;
  const id = pState.levelID;

  if (id === NO_ID_LEVEL) {
    return fetch(API_URL + "/api/level/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
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
    return fetch(API_URL + "/api/level/" + id + "/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
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
  const response = await fetch(`${API_URL}/api/level/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de supprimer le niveau");
  }
}

// Transfer ALL levels from the previous encoding system to the new one ! (by loading all systems and resaving them)
// Use with care !
async function loadAllLevels() {
  const response = await fetch(`${API_URL}/api/level/`); // TODO : ce serait bien d'avoir un point d'entrée qui ne renvoie QUE les ID.
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
          loadLevelFromID_CONNECTED(entry.id, pDispatch);
          saveLevel(pState, pDispatch);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
