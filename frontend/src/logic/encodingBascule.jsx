import { saveLevel, loadLevelFromID_FREE } from "./saveLoad.jsx";
import { API_URL } from "../utils/api.jsx";

// Transfer ALL levels from the previous encoding system to the new one ! (by loading all systems and resaving them)
// Use with care !
async function loadAllLevels() {
  const response = await fetch(`${API_URL}/api/levelIdsNOTOnlyForAdmin/`); // TODO change that, of course
  if (!response.ok) {
    throw new Error("Impossible de récupérer la liste des niveaux !");
  }
  return response.json();
}

export function loadAndSaveALLLevels(pState, pDispatch) {
  loadAllLevels()
    .then((JSONResponse) => {
      console.log(JSONResponse);
      if (
        window.confirm(
          "Vous êtes sur le point de charger puis sauvegarder TOUS les niveaux ! (au nombre de " +
            JSONResponse.length +
            ") : confirmer ?",
        )
      ) {
        JSONResponse.forEach((entry) => {
          loadLevelFromID_FREE(entry, pDispatch); // from entry to dispatch
          saveLevel(pState, pDispatch);
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
