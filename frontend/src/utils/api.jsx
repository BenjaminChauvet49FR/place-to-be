import { LEVEL_FUNCTION } from "../logic/saveLoad.jsx";

const API_URL = process.env.REACT_APP_API_URL;
const API_LEVELS_GENERAL_PUBLIC = "api/levelsGeneralPublic";
const API_LEVEL_EDIT = "api/level";
const API_LEVEL_MAIN_QUEST = "api/levelsMainQuest";

// -------------------------
// Gestion des utilisateurs

// data : {id, username, permissions} (Attention : peut changer si le backend change)

// Connexion
export async function connect(pUsername, pPassword) {
  try {
    // Note : pas de panique, au moment où je pushe ce commit API_URL vaut bien des valeurs différentes en local et en prod !
    const res = await fetch(API_URL + "/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: pUsername, password: pPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Cas d'erreur : identifiants invalides
      throw new Error(data.detail || "Identifiants incorrects");
    }

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
    const token = localStorage.getItem("access_token");

    if (!token) {
      return { success: false }; // TODO voir les logs à cet endroit la
    }

    const res = await fetch(`${API_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //    console.log("me status:", res.status);
    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data }; // TODO c'est quoi les champs de data ?
    } else if (res.status === 401 || res.status === 403) {
      return { success: false }; // TODO voir les logs à cet endroit la
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Creation d'un user
export async function createUser(pUsername, pPassword) {
  try {
    const response = await fetch(`${API_URL}/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        //pUsername,
        //pPassword,
        username: pUsername,
        password: pPassword,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      return { success: true, data };
    } else {
      let error = data.detail;
      if (!error) {
        if (data.userName && data.userName.length) {
          error = data.userName[0];
        }
      }
      if (!error) {
        error = "Erreur inconnue !";
      }

      throw new Error(
        data.detail ||
          (data.username && data.username[0]) ||
          "Erreur inconnue !",
      );
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// -------------------------
// Listes des niveaux

// Obtenir les niveaux accessibles au grand public
export async function getLevelsFreePlay() {
  return await getLevels_aux(`${API_URL}/${API_LEVELS_GENERAL_PUBLIC}/`, {});
}

// Obtenir ses propres niveaux
export async function gerPersonnalLevels() {
  return await getLevels_aux(`${API_URL}/api/myLevels/`, {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });
}

// Obtenir les niveaux de la quête principale
export async function getMainQuestLevels() {
  return await getLevels_aux(`${API_URL}/${API_LEVEL_MAIN_QUEST}/`, {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  });
}

async function getLevels_aux(pURL, pHeaders) {
  try {
    const response = await fetch(pURL, {
      headers: pHeaders, // Note : écrire {pHeaders} provoque une erreur de cross-domain !
    });
    if (response.ok) {
      const data = await response.json();
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
export async function getLastLevelNumber(pUserData) {
  try {
    const response = await fetch(`${API_URL}/${API_LEVEL_MAIN_QUEST}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
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
  const response = await fetch(`${API_URL}/api/TODO/`); // TODO make an endpoint with absolutely all levels !
  if (!response.ok) {
    throw new Error("Impossible de récupérer la liste des niveaux !");
  }
  return response.json();
}

// -------------------------
// Manipuler les niveaux

// Créer un niveau (et l'enregistrer)
export async function promiseSaveNewLevel(pData, pName) {
  /*const response = await fetch(API_URL + "/api/level/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      data: pData,
      name: pName,
    }),
  });
  if (!response.ok) {
    throw new Error(
      "Impossible de sauvegarder le niveau créé. (erreur requête / liaison)",
    );
  } else {
    const levelData = await response.json();
    return levelData.id;
  }*/
  return fetch(API_URL + "/api/level/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      data: pData,
      name: pName,
    }),
  }).then(async (response) => response.json());
}

// Sauver un niveau existant
export async function promiseUpdateLevel(pData, pName, pID) {
  return fetch(API_URL + "/api/level/" + pID + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: JSON.stringify({
      data: pData,
      name: pName,
    }),
  })
    .then(async (response) => response.json().then(() => {}))
    .catch((error) => {
      window.alert("Echec dans l'enregistrement du niveau !");
      throw error;
    });
}

export class Error404 extends Error {
  constructor(message) {
    super(message); // appelle le constructeur de Error
    this.name = "Error404"; // nom de l'erreur
  }
}

// Charger un niveau
export async function promiseLoadLevel(pLevelType, pID_NB) {
  let headers = {};
  let url = `${API_URL}/${API_LEVELS_GENERAL_PUBLIC}/${pID_NB}`;
  if (pLevelType === LEVEL_FUNCTION.GENERAL_CONNECTED) {
    headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    url = `${API_URL}/${API_LEVEL_EDIT}/${pID_NB}`;
  }
  if (pLevelType === LEVEL_FUNCTION.MAIN) {
    headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    url = `${API_URL}/${API_LEVEL_MAIN_QUEST}/${pID_NB}`;
  }
  return fetch(url, { headers: headers }).then((response) => {
    if (response.status === 404) {
      console.log("Niveau non trouvé ! (ou non accessible)");
      throw new Error404();
    }
    return response.json();
  });
}

// Effacer un niveau
export async function deleteLevel(pID) {
  const response = await fetch(`${API_URL}/api/level/${pID}/`, {
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

// Réordonner TOUS les niveaux
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

// -------------------------
//

/* TODO a utiliser plus tard... très important en prod !
fetch(`${API_URL}/api/token/refresh/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    refresh: localStorage.getItem("refresh_token")
  })
});


 */
