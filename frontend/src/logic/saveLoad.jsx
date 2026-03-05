import { SPACE, BLOCK, REAL_XLENGTH, REAL_YLENGTH } from "./constants.jsx";

export function loadLevelForEditor(pLevelData, pLoadingPackage) {
  let x, y;
  let gridF = [];
  let gridM = [];
  let countData = 0;
  let spaceF, spaceM;
  for (y = 0; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    for (x = 0; x < REAL_XLENGTH; x++) {
      if (y == 0 || y == REAL_YLENGTH - 1 || x == 0 || x == REAL_XLENGTH - 1) {
        spaceF = SPACE.WALL;
        spaceM = BLOCK.NONE;
      } else {
        if (countData < pLevelData.length) {
          switch (pLevelData.charAt(countData)) {
            case "1":
              spaceF = SPACE.WALL;
              spaceM = SPACE.NONE;
              break;
            case "0":
              spaceF = SPACE.EMPTY;
              spaceM = BLOCK.NONE;
              break;
            case "A":
              spaceF = SPACE.EMPTY;
              spaceM = BLOCK.A;
              break;
            case "B":
              spaceF = SPACE.EMPTY;
              spaceM = BLOCK.B;
              break;
            case "C":
              spaceF = SPACE.EMPTY;
              spaceM = BLOCK.C;
              break;
            default:
              return 1 / 0;
          }
          countData++;
        } else {
          spaceF = SPACE.EMPTY;
          spaceM = BLOCK.NONE;
        }
      }
      gridF[y].push(spaceF);
      gridM[y].push(spaceM);
    }
  }
  pLoadingPackage.updateGridF(gridF);
  pLoadingPackage.updateGridM(gridM);
}

export function saveLevel(pLevelData) {
  const gridM = pLevelData.gridM;
  const gridF = pLevelData.gridF;
  let x, y;
  let data = "";
  let char = "";
  for (y = 1; y < REAL_YLENGTH - 1; y++) {
    for (x = 1; x < REAL_XLENGTH - 1; x++) {
      switch (gridF[y][x]) {
        case SPACE.WALL:
          char = SPACE.WALL;
          break;
        case SPACE.EMPTY:
          switch (gridM[y][x]) {
            case BLOCK.A:
              char = BLOCK.A;
              break;
            case BLOCK.B:
              char = BLOCK.B;
              break;
            case BLOCK.C:
              char = BLOCK.C;
              break;
            default:
              char = SPACE.EMPTY;
              break;
          }
          break;
        default:
          return 1 / 0;
      }
      data += char;
    }
  }

  fetch("http://localhost:8000/api/level/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"data": "' + data + '"}',
  });
}
