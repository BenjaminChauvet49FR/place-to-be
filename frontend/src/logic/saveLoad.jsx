import { NO_ID_LEVEL } from "./constants.jsx";

import * as encodeDecode from "./encodeDecode.jsx";

import {
  saveNewLevel,
  updateLevel,
  promiseLoadLevel,
  Error404,
} from "../utils/api.jsx";

const BASCULE_ENCODING_HAPPENING = true; // Vaut true si on est en train de basculer les niveaux de l'ancien encodage vers le nouveau
const PREFIX_FOR_NEW_ENCODING_SYSTEM = "*";

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

/*export async function loadLevelFromID_ABSOLUTELY_ALL(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_FUNCTION.ANY);
  await pDispatch({ type: "levelID", levelID: pID }); // Note : changer l'ID n'est pas naturellement fait dans les fonctions "loadLevel", je dois donc le rajouter ici
}*/

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

// Appelé par les principales fonctions qui ont récupéré les données en ligne
function loadLevelForEditor(pLevelData, pName, pDispatch) {
  loadLevelForEditorWithData(pLevelData, pDispatch);
  pDispatch({ type: "levelName", levelName: pName });
}

// Appelé par les fonctions de chargement, mais aussi par le chargement par insertion manuelle de données (d'où l'export)
// Gros risque d'erreur !
export function loadLevelForEditorWithData(pLevelData, pDispatch) {
  let loadedData;

  if (BASCULE_ENCODING_HAPPENING) {
    if (pLevelData.startsWith(PREFIX_FOR_NEW_ENCODING_SYSTEM)) {
      loadedData = encodeDecode.loadLevelForEditorNewSystem(
        pLevelData.substring(1),
      );
    } else {
      loadedData = encodeDecode.loadLevelForEditorPreviousSystem(pLevelData);
    }
  } else {
    if (pLevelData.startsWith(PREFIX_FOR_NEW_ENCODING_SYSTEM)) {
      loadedData = encodeDecode.loadLevelForEditorNewSystem(
        pLevelData.substring(1),
      );
    } else {
      loadedData = encodeDecode.loadLevelForEditorNewSystem(pLevelData);
    }
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
}

export async function saveLevel(pState, pDispatch) {
  return await saveLevel_aux(pState, pDispatch, pState.levelID);
}

/*export async function saveLevelEnMasse(pState, pDispatch, pEntryID) {
  return await saveLevel_aux(pState, pDispatch, pEntryID);
}*/

async function saveLevel_aux(pState, pDispatch, pID) {
  //const { user, amIAnAdmin } = useAuth(); Note : interdit hors react hook ou composant ! Dommage...

  let data = encodeDecode.encodedLevelData(
    pState.gridF,
    pState.gridM,
    pState.movesInfinite,
    pState.movesLimit,
    pState.movesSuperLimit,
  );

  let name = pState.levelName;

  if (BASCULE_ENCODING_HAPPENING) {
    data = PREFIX_FOR_NEW_ENCODING_SYSTEM + data;
  }
  console.log(process.env.REACT_APP_API_URL);
  console.log(process.env);
  if (process.env.REACT_APP_DEBUG === "true") {
    console.log(
      "Post encodage : nom " + pState.levelName + " - id " + pState.levelID,
    );
    console.log(data);
  }

  console.log(data);
  if (pID === NO_ID_LEVEL) {
    const levelData = await saveNewLevel(data, name);
    return pDispatch({ type: "levelID", levelID: levelData.id });
  } else {
    return updateLevel(data, name, pID);
  }
}
