import { LEVEL_FUNCTION } from "../logic/saveLoad.jsx";
import api from "./axios.jsx";

export const API_URL = process.env.REACT_APP_API_URL;
const API_LEVELS_GENERAL_PUBLIC = "api/levelsGeneralPublic";
const API_LEVEL_EDIT = "api/level";
const API_LEVEL_MAIN_QUEST = "api/levelsMainQuest";

// -------------------------
// Gestion des utilisateurs

// data : {id, username, permissions} (Attention : peut changer si le backend change)

// Connexion
export async function connect(pUsername, pPassword) {
  try {
    const res = await api.post("/api/token/", {
      username: pUsername,
      password: pPassword,
    });

    const data = res.data;

    // Cas succès : stocker les tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test de presence basé sur le token
export async function connectFromRefresh() {
  try {
    const res = await api.get(`/api/me/`, {});
    if (res.statusText === "OK") {
      return { success: true, data: res.data };
    } else {
      return { success: false }; // TODO voir les logs à cet endroit la
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
} // Bien simplifié par axios.interceptor ?

// Creation d'un user
export async function createUser(pUsername, pPassword) {
  try {
    const response = await api.post(`/api/register/`, {
      username: pUsername,
      password: pPassword,
    });
    if (response.statusText === "Created") {
      const data = await response.data;
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      return { success: true, data };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// -------------------------
// Listes des niveaux

// Obtenir les niveaux accessibles au grand public
export async function getLevelsFreePlay() {
  return await getLevels_aux(`/${API_LEVELS_GENERAL_PUBLIC}/`);
}

// Obtenir ses propres niveaux
export async function gerPersonnalLevels() {
  return await getLevels_aux(`/api/myLevels/`);
}

// Obtenir les niveaux de la quête principale
export async function getMainQuestLevels() {
  return await getLevels_aux(`/${API_LEVEL_MAIN_QUEST}/`);
}

async function getLevels_aux(pURL) {
  try {
    const response = await api.get(pURL, {});
    if (response.statusText === "OK") {
      const data = response.data;
      return { success: true, levels: data.results };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

// Obtenir le num. de niveau maximal dans la quête principale
export async function getLastLevelNumber() {
  try {
    const response = await api.get(`/${API_LEVEL_MAIN_QUEST}/`, {});
    const data = response.data;
    if (response.statusText !== "OK") {
      throw new Error(data.detail);
    }
    return { success: true, lastLevelNumber: data.results.length };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

// Obtenir TOUS les niveaux
export async function loadAllLevels() {
  const response = await api.get(`/api/TODO/`); // TODO make an endpoint with absolutely all levels !
  if (response.statusText !== "OK") {
    throw new Error("Impossible de récupérer la liste des niveaux !");
  }
  return response.json();
}

// -------------------------
// Manipuler les niveaux

// Créer un niveau (et l'enregistrer)
export async function saveNewLevel(pData, pName) {
  const response = await api.post("/api/level/", {
    lvData: pData,
    name: pName,
  });
  return response.data;
}

// Sauver un niveau existant
export async function updateLevel(pData, pName, pID) {
  const response = await api.put("/api/level/" + pID + "/", {
    lvData: pData,
    name: pName,
  });
  return response.data;
}

export class Error404 extends Error {
  constructor(message) {
    super(message); // appelle le constructeur de Error
    this.name = "Error404"; // nom de l'erreur
  }
}

// Charger un niveau
export async function promiseLoadLevel(pLevelType, pID_NB) {
  let url = `/${API_LEVELS_GENERAL_PUBLIC}/${pID_NB}/`;
  if (pLevelType === LEVEL_FUNCTION.GENERAL_CONNECTED) {
    url = `/${API_LEVEL_EDIT}/${pID_NB}/`;
  }
  if (pLevelType === LEVEL_FUNCTION.MAIN) {
    url = `/${API_LEVEL_MAIN_QUEST}/${pID_NB}/`;
  }
  const response = await api.get(url);
  return response.data;
}

// Effacer un niveau
export async function deleteLevel(pID) {
  const response = await api.delete(`${API_URL}/api/level/${pID}/`);
  if (response.statusText !== "No Content") {
    throw new Error("Impossible de supprimer le niveau");
  }
}

// Réordonner TOUS les niveaux
export async function reorderLevels(pLevelList) {
  const response = await api.post(`${API_URL}/api/reorder/`, {
    idList: pLevelList,
  });

  if (response.statusText !== "OK") {
    throw new Error("Impossible de réordonner les niveaux !");
  }
}
