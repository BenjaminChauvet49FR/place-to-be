export const API_URL = process.env.REACT_APP_API_URL;
export const API_LEVELS_GENERAL_PUBLIC = "api/levelsGeneralPublic";
export const API_LEVEL_EDIT = "api/level";
export const API_LEVEL_MAIN_QUEST = "api/levelsMainQuest";

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

/* TODO a utiliser plus tard... très important en prod !
fetch(`${API_URL}/api/token/refresh/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    refresh: localStorage.getItem("refresh_token")
  })
});


 */
