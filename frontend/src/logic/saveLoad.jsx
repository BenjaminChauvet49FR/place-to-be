import { NO_ID_LEVEL } from "./constants.jsx";

import * as encodeDecode from "./encodeDecode.jsx";

import {
  API_URL,
  API_LEVELS_GENERAL_PUBLIC,
  API_LEVEL_EDIT,
  API_LEVEL_MAIN_QUEST,
} from "../utils/api.jsx";
import Error404 from "./Errors.js";

export const PREFIX_FOR_BASCULE_ENCODING = "TEST_ENCODING_PURPOSE_ONLY";
export const BASCULE_ENCODING_DONE = false; // Only set it to true when encoding bascule has been made and you want to load ALL levels under new system, but you don't want to get rid of the old system yet. Then, to false again.

export function loadNewLevel(pDispatch) {
  loadLevelForEditor("99991", "", pDispatch);
}

const LEVEL_TYPE = {
  GENERAL_CONNECTED: 0,
  GENERAL_FREE: 1,
  MAIN: 2,
}; // Oh, by the way : main = main quest

export async function loadLevelFromID_CONNECTED(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_TYPE.GENERAL_CONNECTED);
}

export async function loadLevelFromID_FREE(pID, pDispatch) {
  await loadLevelFromID_aux(pID, pDispatch, LEVEL_TYPE.GENERAL_FREE);
}

export async function loadMainLevelFromNUMBER_CONNECTED(pNUMBER, pDispatch) {
  await loadLevelFromID_aux(pNUMBER, pDispatch, LEVEL_TYPE.MAIN);
}

async function loadLevelFromID_aux(pID_NB, pDispatch, pLevelType) {
  // pID_NB : ID or number
  let headers = {};
  let url = `${API_URL}/${API_LEVELS_GENERAL_PUBLIC}/${pID_NB}`;
  if (pLevelType === LEVEL_TYPE.GENERAL_CONNECTED) {
    headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    url = `${API_URL}/${API_LEVEL_EDIT}/${pID_NB}`;
  }
  if (pLevelType === LEVEL_TYPE.MAIN) {
    headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    url = `${API_URL}/${API_LEVEL_MAIN_QUEST}/${pID_NB}`;
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
        let errorMsg;
        if (pLevelType === LEVEL_TYPE.MAIN) {
          errorMsg = "Impossible de charger le niveau d'id" + pID_NB;
        } else {
          errorMsg = "Impossible de charger le niveau de numéro " + pID_NB;
        }
        window.alert(errorMsg); // TODO distinguer ces messages d'erreur
        throw error;
      }
    });
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

export function saveLevel(pState, pDispatch) {
  const data = encodeDecode.encodedLevelData(
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
        throw error;
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
        throw error;
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

export async function reorderLevels(pLevelList) {
  const response = await fetch(`${API_URL}/api/reorder/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      idList: pLevelList,
    }),
  });

  if (!response.ok) {
    throw new Error("Impossible de réordonner les niveaux !");
  }
}
