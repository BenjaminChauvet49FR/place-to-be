import { SPACE, BLOCK, REAL_XLENGTH, REAL_YLENGTH } from "../logic/constants";

export function levelEditReducer(pState, pAction) {
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
    case "keepEditorState":
      return {
        ...pState,
        keepEditorState: true,
      };
    case "noLongerKeepEditorState":
      return {
        ...pState,
        keepEditorState: false,
      };

    default:
      console.log("Erreur fatale : mauvaise utilisation de dispatch !");
      console.log(pAction);
      return 1 / 0;
  }
}

function dummyGridF() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      field[y].push(SPACE.EMPTY);
    }
  }
  for (let i = 0; i < REAL_YLENGTH; i++) {
    field[i][0] = SPACE.WALL;
    field[i][REAL_XLENGTH - 1] = SPACE.WALL;
  }
  for (let i = 0; i < REAL_XLENGTH; i++) {
    field[0][i] = SPACE.WALL;
    field[REAL_YLENGTH - 1][i] = SPACE.WALL;
  }
  return field;
}

function dummyGridM() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      field[y].push(BLOCK.NONE);
    }
  }
  return field;
}

export const initialState = {
  gridF: dummyGridF(),
  gridM: dummyGridM(),
  levelID: 0,
  levelName: "",
  currentSpace: SPACE.EMPTY,
  currentBlock: BLOCK.NONE,
  keepEditorState: false,
};
