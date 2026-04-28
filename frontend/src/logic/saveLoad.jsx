import { NO_ID_LEVEL } from "./constants.jsx";

import * as encodeDecode from "./encodeDecode.jsx";

import { saveNewLevel, updateLevel, promiseLoadLevel } from "../utils/api.jsx";

export const PREFIX_FOR_BASCULE_ENCODING = "TEST_ENCODING_PURPOSE_ONLY";
export const BASCULE_ENCODING_DONE = false; // Only set it to true when encoding bascule has been made and you want to load ALL levels under new system, but you don't want to get rid of the old system yet. Then, to false again.

export function loadNewLevel(pDispatch) {
  loadLevelForEditor("99991", "", pDispatch);
}

export const LEVEL_FUNCTION = {
  GENERAL_CONNECTED: 0,
  GENERAL_FREE: 1,
  MAIN: 2,
}; // Oh, by the way : main = main quest

export async function loadLevelFromID_CONNECTED(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.GENERAL_CONNECTED);
}

export async function loadLevelFromID_FREE(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.GENERAL_FREE);
}

export async function loadMainLevelFromNUMBER_CONNECTED(pNUMBER, pDispatch) {
  await loadLevelFromID_aux(pNUMBER, pDispatch, LEVEL_FUNCTION.MAIN);
}

async function loadLevelFromID_aux(pID_NB, pDispatch, pLevelFunction) {
  // pID_NB : ID or number
  try {
    const levelData = await promiseLoadLevel(pLevelFunction, pID_NB);
    loadLevelForEditor(levelData.data, levelData.name, pDispatch);
  } catch (error) {
    console.log(error);
    let errorMsg;
    if (pLevelFunction === LEVEL_FUNCTION.MAIN) {
      errorMsg = "Impossible de charger le niveau d'id" + pID_NB;
    } else {
      errorMsg = "Impossible de charger le niveau de numéro " + pID_NB;
    }
    window.alert(errorMsg); // TODO distinguer ces messages d'erreur
    throw error;
  }
}

// Note : I put this in place as it will be useful whenever I decide to change the encoding system.
// Once the "new loading system" is deemed stable, I rename it into "old system" and leave the "new system" empty.
// That's the best I had found. (after all, changing encoding already requires me to write into this file)
function loadLevelForEditor(pLevelData, pName, pDispatch) {
  let loadedData;
  if (pName.startsWith(PREFIX_FOR_BASCULE_ENCODING) || BASCULE_ENCODING_DONE) {
    loadedData = encodeDecode.loadLevelForEditorNewSystem(pLevelData);
  } else {
    loadedData = encodeDecode.loadLevelForEditorPreviousSystem(pLevelData);
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

export async function saveLevel(pState, pDispatch) {
  const data = encodeDecode.encodedLevelData(
    pState.gridF,
    pState.gridM,
    pState.movesInfinite,
    pState.movesLimit,
  );
  const name = pState.levelName;
  const id = pState.levelID;

  if (id === NO_ID_LEVEL) {
    const levelData = await saveNewLevel(data, name);
    return pDispatch({ type: "levelID", levelID: levelData.id });
  } else {
    return updateLevel(data, name, id);
  }
}
