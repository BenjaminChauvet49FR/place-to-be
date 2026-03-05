export const SPACE = {
  EMPTY: "0",
  WALL: "1",
};

export const BLOCK = {
  A: "A",
  B: "B",
  C: "C",
  NONE: "X",
};

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
