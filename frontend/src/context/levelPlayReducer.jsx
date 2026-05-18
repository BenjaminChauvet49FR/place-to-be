import {
  SPACE,
  REAL_XLENGTH,
  REAL_YLENGTH,
  NO_ID_BLOCK,
  CLEAR,
} from "../logic/constants";

export function levelPlayReducer(pState, pAction) {
  function blockFamilyPlayedChangeClosure(pChange) {
    let newInfos;
    const answer = Object.entries(pState.blockFamiliesInfos).map(
      ([blockFamily, infos]) => {
        newInfos =
          pAction.blockFamily === parseInt(blockFamily, 10) // Yeah, it's "0" or something...
            ? { ...infos, movesPlayed: infos.movesPlayed + pChange }
            : infos;
        return [blockFamily, newInfos];
      },
    );
    return {
      ...pState,
      blockFamiliesInfos: Object.fromEntries(answer),
    };
  }

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
    case "blockFamilies":
      return {
        ...pState,
        blockFamilies: pAction.blockFamilies,
      };
    case "levelName":
      return {
        ...pState,
        levelName: pAction.levelName,
      };
    case "currentBlockFamilyID":
      return {
        ...pState,
        currentBlockFamilyID: pAction.currentBlockFamilyID,
      };
    case "levelState":
      return {
        ...pState,
        gridM: pAction.gridM,
        moves: pAction.moves,
        itemsInGrid: pAction.itemsInGrid,
      };
    case "blockFamiliesInfos":
      return {
        ...pState,
        blockFamiliesInfos: pAction.blockFamiliesInfos,
      };
    case "clear":
      return {
        ...pState,
        clear: pAction.clear,
      };
    case "blockFamilyPlayedPlus1":
      return blockFamilyPlayedChangeClosure(1);
    case "blockFamilyPlayedMinus1":
      return blockFamilyPlayedChangeClosure(-1);

    default:
      console.log(
        "Erreur fatale : mauvaise utilisation de dispatch de levelPlayReducer ! (" +
          pAction.type +
          ")",
      );
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
      field[y].push(NO_ID_BLOCK);
    }
  }
  return field;
}

export const initialState = {
  gridF: dummyGridF(),
  gridM: dummyGridM(),
  blockFamilies: [],
  blockFamiliesInfos: {}, // Contains : a list of items with key colours, and infos {index, movesPlayed} (see gameplay.jsx...)
  levelName: "",
  currentBlockFamilyID: 0, // TODO add some constraint to make sure it is always between 0 and blockFamilies.length
  moves: [],
  itemsInGrid: [],
  clear: CLEAR.NO,
};
