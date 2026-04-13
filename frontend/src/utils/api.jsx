export const API_URL = process.env.REACT_APP_API_URL;

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
