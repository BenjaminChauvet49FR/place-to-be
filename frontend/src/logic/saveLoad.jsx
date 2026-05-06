import { NO_ID_LEVEL } from "./constants.jsx";

import * as encodeDecode from "./encodeDecode.jsx";

import {
  saveNewLevel,
  updateLevel,
  promiseLoadLevel,
  Error404,
} from "../utils/api.jsx";

export const PREFIX_FOR_BASCULE_ENCODING = "TEST_ENCODING_PURPOSE_ONLY";
const BASCULE_ENCODING_HAPPENING = true; // Vaut true si on est en train de basculer les niveaux de l'ancien encodage vers le nouveau

export function loadNewLevel(pDispatch) {
  loadLevelForEditor(encodeDecode.DUMMY_DATA, "", pDispatch);
}

export const LEVEL_FUNCTION = {
  GENERAL_EDITION: 0,
  GENERAL_FREEPLAY: 1,
  MAIN: 2,
  ANY: 3,
}; // Oh, by the way : main = main quest

export async function loadLevelFromID_CONNECTED(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.GENERAL_EDITION);
}

export async function loadLevelFromID_FREEPLAY(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.GENERAL_FREEPLAY);
}

export async function loadLevelFromID_ABSOLUTELY_ALL(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.ANY);
  await pDispatch({ type: "levelID", levelID: pID }); // Note : changer l'ID n'est pas naturellement fait dans les fonctions "loadLevel", je dois donc le rajouter ici
}

export async function loadMainLevelFromNUMBER_CONNECTED(pNUMBER, pDispatch) {
  await loadLevelFromID_aux(pNUMBER, pDispatch, LEVEL_FUNCTION.MAIN);
}

async function loadLevelFromID_aux(pID_NB, pDispatch, pLevelFunction) {
  // pID_NB : ID or number
  try {
    const levelData = await promiseLoadLevel(pLevelFunction, pID_NB);
    loadLevelForEditor(levelData.lvData, levelData.name, pDispatch);
    pDispatch({ type: "levelID", levelID: levelData.id }); // Note : sans cette ligne, pas de connaissance d'ID du niveau en gameplay !
  } catch (error) {
    if (error instanceof Error404) {
      throw error;
    } else {
      let errorMsg;
      if (pLevelFunction === LEVEL_FUNCTION.MAIN) {
        errorMsg = "Impossible de charger le niveau d'id " + pID_NB;
      } else {
        errorMsg = "Impossible de charger le niveau de numéro " + pID_NB;
      }
      throw new Error(errorMsg);
    }
  }
}

// Note : I put this in place as it will be useful whenever I decide to change the encoding system.
// Once the "new loading system" is deemed stable, I rename it into "old system" and leave the "new system" empty.
// That's the best I had found. (after all, changing encoding already requires me to write into this file)
function loadLevelForEditor(pLevelData, pName, pDispatch) {
  let loadedData;
  if (pName.startsWith(PREFIX_FOR_BASCULE_ENCODING)) {
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
  pDispatch({
    type: "movesSuperLimit_ALL",
    movesSuperLimit: loadedData.movesSuperLimit,
  });

  pDispatch({ type: "levelName", levelName: pName });
}

export async function saveLevel(pState, pDispatch) {
  return await saveLevel_aux(pState, pDispatch, pState.levelID);
}

export async function saveLevelEnMasse(pState, pDispatch, pEntryID) {
  return await saveLevel_aux(pState, pDispatch, pEntryID);
}

async function saveLevel_aux(pState, pDispatch, pID) {
  const data = encodeDecode.encodedLevelData(
    pState.gridF,
    pState.gridM,
    pState.movesInfinite,
    pState.movesLimit,
    pState.movesSuperLimit,
  );
  let name = pState.levelName;
  //const id = pForcedID ? pForcedID : pState.levelID; note : remplaçait pID avant, mais pour une certaine raison quand j'updatais l'ID via dispatch ça ne mettait pas à jour state.id, ce qui était gênant pour la bascule d'encodage où je cherchais à re-sauvegarder tous les niveaux !
  // Voilà pourquoi j'ai forcé l'ID à l'exérieur
  if (BASCULE_ENCODING_HAPPENING) {
    if (!name.startsWith(PREFIX_FOR_BASCULE_ENCODING)) {
      name = PREFIX_FOR_BASCULE_ENCODING + name;
    }
    console.log("Post encodage : " + pState.levelName + " - " + pState.levelID);
    console.log(data);
  } else {
    if (name.startsWith(PREFIX_FOR_BASCULE_ENCODING)) {
      name = name.substring(PREFIX_FOR_BASCULE_ENCODING.length);
    }
  }

  if (pID === NO_ID_LEVEL) {
    const levelData = await saveNewLevel(data, name);
    return pDispatch({ type: "levelID", levelID: levelData.id });
  } else {
    return updateLevel(data, name, pID);
  }
}
