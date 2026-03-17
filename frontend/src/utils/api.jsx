export const API_URL = process.env.REACT_APP_API_URL;

export async function connect(pUsername, pPassword) {
  try {
    const res = await fetch("http://localhost:8000/api/token/", {
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
