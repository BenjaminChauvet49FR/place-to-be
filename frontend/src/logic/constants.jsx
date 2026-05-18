// ====================================================
// Field part

export const SPACE = {
  EMPTY: "0",
  WALL: "1",
  GOAL_A: "A",
  GOAL_B: "B",
  GOAL_C: "C",
};

export const SPACE_DISPLAY_INFO = {
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
  A_NORMAL: "A",
  B_NORMAL: "B",
  C_NORMAL: "C",
  A_STEEL: "G",
  B_STEEL: "H",
  C_STEEL: "I",
  NONE: "-",
};

export const BLOCK_DISPLAY_INFO = {
  [BLOCK.NONE]: {
    captionEditor: "vide",
    className: "space_blockA",
    isSteel: false,
  },
  [BLOCK.A_NORMAL]: {
    captionEditor: "A",
    className: "space_blockA",
    isSteel: false,
  },
  [BLOCK.B_NORMAL]: {
    captionEditor: "B",
    className: "space_blockB",
    isSteel: false,
  },
  [BLOCK.C_NORMAL]: {
    captionEditor: "C",
    className: "space_blockC",
    isSteel: false,
  },
  [BLOCK.A_STEEL]: {
    captionEditor: "A",
    className: "space_block_steelA",
    isSteel: true,
  },
  [BLOCK.B_STEEL]: {
    captionEditor: "B",
    className: "space_block_steelB",
    isSteel: true,
  },
  [BLOCK.C_STEEL]: {
    captionEditor: "C",
    className: "space_block_steelC",
    isSteel: true,
  },
};

/*export const BLOCK_TYPES_LIST = [
  { goal: SPACE.GOAL_A, block: BLOCK.A, cn: "A", id: 0 },
  { goal: SPACE.GOAL_B, block: BLOCK.B, cn: "B", id: 1 },
  { goal: SPACE.GOAL_C, block: BLOCK.C, cn: "C", id: 2 },
];*/

export function blockFamilyFromStr(p_str) {
  switch (p_str) {
    case BLOCK.A_NORMAL:
    case BLOCK.A_STEEL:
      return 0;
    case BLOCK.B_NORMAL:
    case BLOCK.B_STEEL:
      return 1;
    case BLOCK.C_NORMAL:
    case BLOCK.C_STEEL:
      return 2;
    default:
      return -1;
  }
}

export function isSteelFromStr(p_str) {
  return (
    p_str === BLOCK.A_STEEL ||
    p_str === BLOCK.B_STEEL ||
    p_str === BLOCK.C_STEEL
  );
}

export function spaceFamilyFromStr(p_str) {
  switch (p_str) {
    case SPACE.GOAL_A:
      return 0;
    case SPACE.GOAL_B:
      return 1;
    case SPACE.GOAL_C:
      return 2;
    default:
      return -1;
  }
}

/*BLOCK_TYPES_LIST.forEach((block) => {
  BLOCK_INFO[block.block].id = block.id;
});*/

export function NEW_ARRAY_MOVES_INFINITE() {
  return new Array(10).fill(false);
}
export function NEW_ARRAY_MOVES_LIMIT() {
  return new Array(10).fill(0);
}

export const BLOCK_FAMILIES = [
  {
    id: 0,
    letter: "A", // The letter that represents that family
    target: SPACE.GOAL_A,
    normal: BLOCK.A_NORMAL,
    steel: BLOCK.A_STEEL,
  },
  {
    id: 1,
    letter: "B",
    target: SPACE.GOAL_B,
    normal: BLOCK.B_NORMAL,
    steel: BLOCK.B_STEEL,
  },
  {
    id: 2,
    letter: "C",
    target: SPACE.GOAL_C,
    normal: BLOCK.C_NORMAL,
    steel: BLOCK.C_STEEL,
  },
];

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
export const DO_NOT_CHANGE = " "; // Good for editor.

// ----------------------------------------------------
// Winning part
export const CLEAR = {
  NO: 0,
  PARTIAL: 1,
  TOTAL: 2,
};

// ----------------------------------------------------
// Field limits part
export function canChangeSpace(pX, pY) {
  // limits for puttable blocks = 1-20 in X and 1-20 in Y ; 0 and 21 filled with walls
  return 0 < pX && pX < REAL_XLENGTH - 1 && 0 < pY && pY < REAL_YLENGTH - 1;
}

// ====================================================
// Save load part

export function stringMeansBlock(pBlockStr) {
  return !pBlockStr.startsWith("-");
}

/*export const blockToEncodedBlock = (pChar) => pChar.toLowerCase();
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
}*/
