export const SPACE = {
  EMPTY: "0",
  WALL: "1",
  GOAL_A: "A",
  GOAL_B: "B",
  GOAL_C: "C",
};

export const BLOCK = {
  A: "A",
  B: "B",
  C: "C", // WARNING : when you add a block, think about adding it to "isBlockForEditor" (among others)
  NONE: "X",
};
const BLOCK_ARRAY = ["A", "B", "C"];

export const DIRECTION = {
  L: 0,
  U: 1,
  R: 2,
  D: 3,
};

export function OPPOSITE_DIRECTION(pDir) {
  return (pDir + 2) % 4;
}

export const MOVES = [
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
];

export const NO_ID_BLOCK = -1;
export const REAL_XLENGTH = 22; // These are the xLength and the yLength of the global array. The playfield is meant to be 20x20 (which should be enough for most levels)
export const REAL_YLENGTH = 22; // ... but we add 2 spaces, one on each edge

export const NO_ID_LEVEL = 0;
export const DO_NOT_CHANGE = -6; // Good for editor.

// ====================================================
// Save load part

export function isBlock(pChar) {
  for (let iCheck = 0; iCheck < BLOCK_ARRAY.length; iCheck++) {
    if (pChar === BLOCK_ARRAY[iCheck]) {
      return true;
    }
  }
  return false;
  //  return pChar in BLOCK_ARRAY; // The expression ('A' in ['A']) is FALSE !
}
export function blockToEncodedBlock(pChar) {
  return pChar.toLowerCase();
}
export function encodedBlockToBlock(pChar) {
  return pChar.toUpperCase();
}
const ENCODED_BLOCK_ARRAY = BLOCK_ARRAY.map((char) =>
  blockToEncodedBlock(char),
);

export function isEncodedBlock(pChar) {
  for (let iCheck = 0; iCheck < ENCODED_BLOCK_ARRAY.length; iCheck++) {
    if (pChar === ENCODED_BLOCK_ARRAY[iCheck]) {
      return true;
    }
  }
  return false;
}
