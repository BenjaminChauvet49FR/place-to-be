export function reducer(pState, pAction) {
  switch (pAction.type) {
    case "gridF":
      return {
        ...pState,
        gridF: pState.gridF.map((row, y) =>
          y !== pAction.y
            ? row
            : row.map((cell, x) => (x === pAction.x ? pAction.value : cell)),
        ),
      };
    case "gridF_ALL":
      return {
        ...pState,
        gridF: pAction.gridF.map((row, y) =>
          row.map((_, x) => pAction.gridF[y][x]),
        ),
      };
    case "gridM":
      return {
        ...pState,
        gridM: pState.gridM.map((row, y) =>
          y !== pAction.y
            ? row
            : row.map((cell, x) => (x === pAction.x ? pAction.value : cell)),
        ),
      };
    case "gridM_ALL":
      return {
        ...pState,
        gridM: pAction.gridM.map((row, y) =>
          row.map((_, x) => pAction.gridM[y][x]),
        ),
      };
    case "levelID":
      return {
        ...pState,
        levelID: pAction.levelID,
      };
    case "levelName":
      return {
        ...pState,
        levelName: pAction.levelName,
      };
    case "currentSpace":
      return {
        ...pState,
        currentSpace: pAction.value,
      };
    case "currentBlock":
      return {
        ...pState,
        currentBlock: pAction.value,
      };

    default:
      console.log("Erreur fatale : mauvaise utilisation de dispatch !");
      console.log(pAction);
      return 1 / 0;
  }
}
