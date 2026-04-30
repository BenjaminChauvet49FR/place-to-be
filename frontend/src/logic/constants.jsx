// ====================================================
// Field part

export const SPACE = {
  EMPTY: "0",
  WALL: "1",
  GOAL_A: "A",
  GOAL_B: "B",
  GOAL_C: "C",
};

export const SPACE_INFO = {
  [SPACE.EMPTY]: {
    captionEditor: "vide",
    className: "space_empty",
  },
  [SPACE.WALL]: {
    captionEditor: "mur",
    className: "space_wall",
  },
  [SPACE.GOAL_A]: {
    captionEditor: "A",
    className: "space_goalA",
  },
  [SPACE.GOAL_B]: {
    captionEditor: "B",
    className: "space_goalB",
  },
  [SPACE.GOAL_C]: {
    captionEditor: "C",
    className: "space_goalC",
  },
};
export const BLOCK = {
  A: "A",
  B: "B",
  C: "C",
  NONE: "X",
};
export const BLOCK_INFO = {
  [BLOCK.NONE]: {
    captionEditor: "vide",
    className: "space_blockA",
    isRealBlock: false,
  },
  [BLOCK.A]: {
    captionEditor: "A",
    className: "space_blockA",
    isRealBlock: true,
  },
  [BLOCK.B]: {
    captionEditor: "B",
    className: "space_blockB",
    isRealBlock: true,
  },
  [BLOCK.C]: {
    captionEditor: "C",
    className: "space_blockC",
    isRealBlock: true,
  },
};

export const BLOCK_TYPES_LIST = [
  { goal: SPACE.GOAL_A, block: BLOCK.A, cn: "A", id: 0 },
  { goal: SPACE.GOAL_B, block: BLOCK.B, cn: "B", id: 1 },
  { goal: SPACE.GOAL_C, block: BLOCK.C, cn: "C", id: 2 },
];

BLOCK_TYPES_LIST.forEach((block) => {
  BLOCK_INFO[block.block].id = block.id;
});

export function NEW_ARRAY_MOVES_INFINITE() {
  return new Array(10).fill(false);
}
export function NEW_ARRAY_MOVES_LIMIT() {
  return new Array(10).fill(0);
}

// ----------------------------------------------------
// Superposition part

export const SUPERPOSITION_NONE = "superposition none";
export const SUPERPOSITION_CORRECT = "superposition correct";
export const SUPERPOSITION_WRONG = (pColour) =>
  "superposition wrong_" + pColour;

// ====================================================
// Direction part

export const DIRECTION = {
  L: 0,
  U: 1,
  R: 2,
  D: 3,
};

export const OPPOSITE_DIRECTION = (pDir) => (pDir + 2) % 4;

export const MOVES = [
  { dx: -1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
];

// ====================================================
// Misc part

export const NO_ID_BLOCK = -1;
export const REAL_XLENGTH = 22; // These are the xLength and the yLength of the global array. The playfield is meant to be 20x20 (which should be enough for most levels)
export const REAL_YLENGTH = 22; // ... but we add 2 spaces, one on each edge

export const NO_ID_LEVEL = 0;
export const DO_NOT_CHANGE = -6; // Good for editor.

// ----------------------------------------------------
// Limits part
export function canChangeSpace(pX, pY) {
  // limits for puttable blocks = 1-20 in X and 1-20 in Y ; 0 and 21 filled with walls
  return 0 < pX && pX < REAL_XLENGTH - 1 && 0 < pY && pY < REAL_YLENGTH - 1;
}

// ====================================================
// Save load part

export const isBlock = (pChar) => BLOCK_INFO[pChar].isRealBlock;
export const blockToEncodedBlock = (pChar) => pChar.toLowerCase();
export const encodedBlockToBlock = (pChar) => pChar.toUpperCase();

const ENCODED_BLOCK_ARRAY = Object.values(BLOCK)
  .filter((char) => BLOCK_INFO[char].isRealBlock)
  .map((char) => blockToEncodedBlock(char));

export function isEncodedBlock(pChar) {
  for (let iCheck = 0; iCheck < ENCODED_BLOCK_ARRAY.length; iCheck++) {
    if (pChar === ENCODED_BLOCK_ARRAY[iCheck]) {
      return true;
    }
  }
  return false;
}
