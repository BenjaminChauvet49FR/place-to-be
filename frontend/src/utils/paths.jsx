export const paths = {
  home: () => `/`,
  newUser: () => `/newUser`,

  // Distnction editLevelColon / editLevel :
  // Le premier sert dans le routeur, avec :levelId, pour indiquer une route. Le second sert pour rejoindre directement une page, via

  // Edition de niveaux (liste - edition - jeu depuis edition)
  levelListForEditor: () => `/edit`,
  editLevel: (id) => `/editLevel/${id}`,
  editLevelRouter: () => "/editLevel/:levelId",
  editLevelNew: () => `/editLevel/new`,
  editLevelPlaying: () => `/editLevel/playing`,

  // Niveaux, categorie libre
  levelListForFreePlay: () => `/play`,
  playLevelFreeRouter: () => "/play/:levelId",
  playLevelFree: (id) => `/play/${id}`,

  // Niveaux, categorie principale
  levelListForMainQuest: () => `/quest`,
  playLevelQuestRouter: () => "/quest/:levelNumber",
  playLevelQuest: (nb) => `/quest/${nb}`,

  // Niveau non trouvé
  notFoundLevel: () => `/notFoundLevel`,
  noLevelQuest: () => `/noLevelQuest`,
  // Note : les liens "accès à une liste de niveaux" sont directement dans PrivateRoute.jsx ...
};

export function doIComeFromEditor() {
  return window.location.pathname.includes("playing");
}

export function amIInMainQuest() {
  return window.location.pathname.includes("quest");
}
