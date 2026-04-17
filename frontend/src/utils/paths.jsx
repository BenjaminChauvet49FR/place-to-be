export const paths = {
  editLevel: (id) => `/editLevel/${id}`,
  editNewLevel: () => `/editLevel/new`,
  levelListForEditor: () => `/edit`,
  levelListForPlay: () => `/play`,
  playLevel: (id) => `/play/${id}`,
  playing: () => `/editLevel/playing`,
  noEditLevel: () => `/doNotEditLevel`,
  notFoundLevel: () => `/notFoundLevel`,
  newUser: () => `/newUser`,
  home: () => `/`,
  editLevelId: () => "/editLevel/:levelId",
  playLevelId: () => "/play/:levelId",
};

export function doIComeFromEditor() {
  return window.location.pathname.includes("playing");
}
