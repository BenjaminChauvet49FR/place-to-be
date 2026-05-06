import {
  NEW_ARRAY_MOVES_INFINITE,
  NEW_ARRAY_MOVES_LIMIT,
  REAL_XLENGTH,
  REAL_YLENGTH,
  SPACE,
  BLOCK,
  BLOCK_INFO,
  isEncodedBlock,
  encodedBlockToBlock,
  isBlock,
  blockToEncodedBlock,
} from "./constants.jsx";

// Note : we assume all parameters passed are fine in the use of enconding and decoding functions
const MASTER_STRING =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&$";
const INFINITE_SYMBOL = "-";
const EXTENSION_MARK = "+";
const NUMBER_THAT_MEANS_INFINITE = -1;
const SPLIT_TOKEN = ";";
export const DUMMY_DATA = "99991;";

/** For numbers 0 to 63 */
function valToChar(pVal) {
  return MASTER_STRING.charAt(pVal);
}

function charToVal(pChar) {
  return MASTER_STRING.indexOf(pChar);
}

/** For numbers 0 to 127 */
function val127ToString(pVal) {
  if (pVal >= 64) {
    return EXTENSION_MARK + valToChar(pVal - 64);
  } else {
    return valToChar(pVal);
  }
}

function val4095toString(pVal) {
  return valToChar(Math.floor(pVal / 64)) + valToChar(pVal % 64);
}

// pDecoder = item with a property "index"
// pDecoder = {index : 0}
// successive uses of stringToVal127("36+5", pDecoder) returns 3 (for "3"), 6 (for "6") and 69 (for "+5")
function stringToVal127OrInfinite(pString, pDecoder) {
  if (pString.charAt(pDecoder.index) === EXTENSION_MARK) {
    pDecoder.index += 2;
    return 64 + charToVal(pString.charAt(pDecoder.index - 1));
  } else if (pString.charAt(pDecoder.index) === INFINITE_SYMBOL) {
    pDecoder.index++;
    return NUMBER_THAT_MEANS_INFINITE;
  } else {
    pDecoder.index++;
    return charToVal(pString.charAt(pDecoder.index - 1));
  }
}

function stringToVal4095(pChar1, pChar2) {
  return charToVal(pChar1) * 64 + charToVal(pChar2);
}

export function loadLevelForEditorPreviousSystem(pLevelData) {
  //return loadLevelForEditorNewSystem(pLevelData);

  let x, y;
  let gridF = [];
  let gridM = [];
  let xFirst = charToVal(pLevelData.charAt(0));
  let yFirst = charToVal(pLevelData.charAt(1));
  let xLast = charToVal(pLevelData.charAt(2));
  let yLast = charToVal(pLevelData.charAt(3));
  let movesInfinite = NEW_ARRAY_MOVES_INFINITE();
  let movesLimit = NEW_ARRAY_MOVES_LIMIT();
  let movesSuperLimit = NEW_ARRAY_MOVES_LIMIT();

  for (y = 0; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    for (x = 0; x < REAL_XLENGTH; x++) {
      gridF[y].push(
        x === 0 || x === REAL_XLENGTH - 1 || y === 0 || y === REAL_YLENGTH - 1
          ? SPACE.WALL
          : SPACE.EMPTY,
      );
      gridM[y].push(BLOCK.NONE);
    }
  }

  let levelSize = (yLast - yFirst + 1) * (xLast - xFirst + 1);
  let dataMain = pLevelData.substring(4, 4 + levelSize);
  let dataPostGrid = pLevelData.substring(4 + levelSize);

  let iData = 0;
  let iDataBelow = 0;
  let char;
  let blockTypesMet = [];

  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      char = dataMain.charAt(iData);
      if (isEncodedBlock(char)) {
        gridF[y][x] = dataPostGrid.charAt(iDataBelow);
        gridM[y][x] = encodedBlockToBlock(char);
        if (blockTypesMet.indexOf(gridM[y][x]) === -1) {
          blockTypesMet.push(gridM[y][x]);
        }
        iDataBelow++;
      } else {
        gridF[y][x] = char;
        gridM[y][x] = BLOCK.NONE;
      }
      iData++;
    }
  }
  // Now, all the data "below items" should be clear, and we are set to iDataBelow. Let's cut the string !

  dataPostGrid = dataPostGrid.substring(iDataBelow);
  let decoder = { index: 0 };
  let blockTypeMetIndex = 0;
  let value;
  let idBlock;
  while (decoder.index < dataPostGrid.length) {
    value = stringToVal127OrInfinite(dataPostGrid, decoder); // Decoder goes up by 1 or 2...
    idBlock = BLOCK_INFO[blockTypesMet[blockTypeMetIndex]].id;
    blockTypeMetIndex++; // ... and blockTypeMetIndex by 1.
    movesInfinite[idBlock] = value === NUMBER_THAT_MEANS_INFINITE;
    if (!movesInfinite[idBlock]) {
      movesLimit[idBlock] = value;
    }
    movesSuperLimit[idBlock] = 99;
  }

  // Don't forget the "return" !
  return {
    gridF: gridF,
    gridM: gridM,
    movesInfinite: movesInfinite,
    movesLimit: movesLimit,
    movesSuperLimit: movesSuperLimit,
  };
}

export function loadLevelForEditorNewSystem(pLevelData) {
  //return loadLevelForEditorPreviousSystem(pLevelData);
  let x, y;
  let gridF = [];
  let gridM = [];
  let xFirst = charToVal(pLevelData.charAt(0));
  let yFirst = charToVal(pLevelData.charAt(1));
  let xLast = charToVal(pLevelData.charAt(2));
  let yLast = charToVal(pLevelData.charAt(3));
  let movesInfinite = NEW_ARRAY_MOVES_INFINITE();
  let movesLimit = NEW_ARRAY_MOVES_LIMIT();
  let movesSuperLimit = NEW_ARRAY_MOVES_INFINITE();

  for (y = 0; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    for (x = 0; x < REAL_XLENGTH; x++) {
      gridF[y].push(
        x === 0 || x === REAL_XLENGTH - 1 || y === 0 || y === REAL_YLENGTH - 1
          ? SPACE.WALL
          : SPACE.EMPTY,
      );
      gridM[y].push(BLOCK.NONE);
    }
  }

  let levelSize = (yLast - yFirst + 1) * (xLast - xFirst + 1);
  let dataMain = pLevelData.substring(4, 4 + levelSize);
  let dataPostGrid = pLevelData.substring(4 + levelSize);

  let iData = 0;
  let iDataBelow = 0;
  let char;
  let blockTypesMet = [];

  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      char = dataMain.charAt(iData);
      if (isEncodedBlock(char)) {
        gridF[y][x] = dataPostGrid.charAt(iDataBelow);
        gridM[y][x] = encodedBlockToBlock(char);
        if (blockTypesMet.indexOf(gridM[y][x]) === -1) {
          blockTypesMet.push(gridM[y][x]);
        }
        iDataBelow++;
      } else {
        gridF[y][x] = char;
        gridM[y][x] = BLOCK.NONE;
      }
      iData++;
    }
  }
  // Now, all the data "below items" should be clear, and we are set to iDataBelow. Let's cut the string !
  dataPostGrid = dataPostGrid.substring(iDataBelow);
  let dataNormalLimit = dataPostGrid.split(SPLIT_TOKEN)[0];
  let dataSuperLimit = dataPostGrid.split(SPLIT_TOKEN)[1];
  let decoder = { index: 0 };
  let blockTypeMetIndex = 0;
  let value;
  let idBlock;
  while (decoder.index < dataNormalLimit.length) {
    value = stringToVal127OrInfinite(dataNormalLimit, decoder); // Decoder goes up by 1 or 2...
    idBlock = BLOCK_INFO[blockTypesMet[blockTypeMetIndex]].id;
    blockTypeMetIndex++; // ... and blockTypeMetIndex by 1.
    movesInfinite[idBlock] = value === NUMBER_THAT_MEANS_INFINITE;
    if (!movesInfinite[idBlock]) {
      movesLimit[idBlock] = value;
    }
  }
  for (let i = 0; i < dataSuperLimit.length; i += 2) {
    blockTypeMetIndex = i / 2;
    idBlock = BLOCK_INFO[blockTypesMet[blockTypeMetIndex]].id;
    movesSuperLimit[idBlock] = stringToVal4095(
      dataSuperLimit.charAt(i),
      dataSuperLimit.charAt(i + 1),
    );
  }

  // Don't forget the "return" !
  return {
    gridF: gridF,
    gridM: gridM,
    movesInfinite: movesInfinite,
    movesLimit: movesLimit,
    movesSuperLimit: movesSuperLimit,
  };
}

export function encodedLevelData(
  pGridF,
  pGridM,
  pMovesInfinite,
  pMovesLimit,
  pMovesSuperLimit,
) {
  // Note : here, pState is read but not written... except for ID.

  let x, y;
  let xFirst = 99;
  let yFirst = 99;
  let xLast = -1;
  let yLast = -1;

  // Scanning the topleft and bottomright squares
  for (y = 1; y < REAL_YLENGTH - 1; y++) {
    for (x = 1; x < REAL_XLENGTH - 1; x++) {
      if (pGridF[y][x] !== SPACE.EMPTY || pGridM[y][x] !== BLOCK.NONE) {
        xFirst = Math.min(xFirst, x);
        yFirst = Math.min(yFirst, y);
        xLast = Math.max(xLast, x);
        yLast = Math.max(yLast, y);
      }
    }
  }
  if (xFirst === 99) {
    xFirst = Math.floor(REAL_XLENGTH / 2);
    yFirst = Math.floor(REAL_YLENGTH / 2);
    xLast = xFirst;
    yLast = yFirst;
  }

  let dataSize =
    valToChar(xFirst) + valToChar(yFirst) + valToChar(xLast) + valToChar(yLast);

  let dataBelowItems = "";
  let dataMain = "";
  let char = "";
  let dataMovesPerColour = "";
  let seenColours = []; // Ordre des couleurs par >>> premier bloc rencontré <<< en lisant la grille en par ordre de lecture
  let dataSuperMovesPerColour = "";
  let id;
  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      if (isBlock(pGridM[y][x])) {
        char = blockToEncodedBlock(pGridM[y][x]);
        dataBelowItems += pGridF[y][x];
        if (seenColours.indexOf(pGridM[y][x]) === -1) {
          seenColours.push(pGridM[y][x]);
          id = BLOCK_INFO[pGridM[y][x]].id;
          if (pMovesInfinite[id]) {
            dataMovesPerColour += INFINITE_SYMBOL;
          } else {
            dataMovesPerColour += val127ToString(pMovesLimit[id]);
          }
          dataSuperMovesPerColour += val4095toString(pMovesSuperLimit[id]);
        }
      } else {
        char = pGridF[y][x];
      }
      dataMain += char;
    }
  }
  return (
    dataSize +
    dataMain +
    dataBelowItems +
    dataMovesPerColour +
    SPLIT_TOKEN +
    dataSuperMovesPerColour
  );
}
