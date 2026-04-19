export const paths = {
  editLevel: (id) => `/editLevel/${id}`,
  editNewLevel: () => `/editLevel/new`,
  levelListForEditor: () => `/edit`,
  levelListForPlay: () => `/play`,
  levelListForMainQuest: () => `/quest`,
  playLevel: (id) => `/play/${id}`,
  playing: () => `/editLevel/playing`,
  noEditLevel: () => `/doNotEditLevel`,
  notFoundLevel: () => `/notFoundLevel`,
  noLevelQuest: () => `/noLevelQuest`,
  newUser: () => `/newUser`,
  home: () => `/`,
  editLevelId: () => "/editLevel/:levelId",
  playLevelId: () => "/play/:levelId",
  playLevelQuestNumber: () => "/quest/:levelNumber",
  playLevelQuest: (nb) => `/quest/${nb}`,
};

export function doIComeFromEditor() {
  return window.location.pathname.includes("playing");
}

export function amIInMainQuest() {
  return window.location.pathname.includes("quest");
}
