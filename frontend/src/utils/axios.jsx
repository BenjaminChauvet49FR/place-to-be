import axios from "axios";

/*
  Instance Axios dédiée à TON backend.
  => On utilise api.get(), api.post(), etc.
*/
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // adapte à ton backend Django
  withCredentials: true, // indispensable si refresh token en cookie
  headers: {
    "Content-Type": "application/json",
  },
});

/* =======================================================
   RESPONSE INTERCEPTOR
   Si 401 => tente refresh => rejoue requête originale
======================================================= */
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Si pas de réponse serveur
    if (!error.response) {
      return Promise.reject(error);
    }

    // Si refresh lui-même échoue, on arrête
    if (originalRequest.url.includes("/api/refresh/")) {
      return Promise.reject(error);
    }

    // Si access expiré
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/api/refresh/"); // Note : adieu le stockage local pour refresh. En outre, le cookie part automatiquement si withCredentials = true.

        localStorage.setItem("access_token", res.data.access);

        // On met à jour la requête initiale
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        // On rejoue la requête initiale
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh expiré => vraie déconnexion
        localStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  const excluded =
    config.url.includes("/api/refresh/") ||
    config.url.includes("/api/login/") ||
    config.url.includes("/api/register/");

  if (token && !excluded) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
