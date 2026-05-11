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
  NO_ID_BLOCK,
  BLOCK_TYPES_LIST,
} from "./constants.jsx";

// Note : we assume all parameters passed are fine in the use of enconding and decoding functions
const OLD_MASTER_STRING =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz&$";
const NEW_MASTER_STRING =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&$";
const MASTER_STRING_TYPES = "ABCDEF";

const INFINITE_SYMBOL = "-";
const EXTENSION_MARK = "+";
const NUMBER_THAT_MEANS_INFINITE = -1;
const SPLIT_TOKEN = ";";
export const DUMMY_DATA = "99991;";

/** For numbers 0 to 63 */
function valToChar(pVal) {
  return NEW_MASTER_STRING.charAt(pVal);
}

function newCharToVal(pChar) {
  return NEW_MASTER_STRING.indexOf(pChar);
}

function oldCharToVal(pChar) {
  return OLD_MASTER_STRING.indexOf(pChar);
}

/** For numbers 0 to 1023 */
function valToBase32Str(pVal) {
  if (pVal <= 31) {
    return NEW_MASTER_STRING[pVal];
  } else {
    return (
      NEW_MASTER_STRING[31 + Math.floor(pVal / 32)] +
      NEW_MASTER_STRING[pVal % 32]
    );
  }
  // 31 v ; 32-63 w0-wv ; 64-95 x0-xv ...
}

// See below ; pDecoder = {index : ...}
function stringBase32ToVal(pString, pDecoder) {
  let char = pString.charAt(pDecoder.index);
  let answer = newCharToVal(char);
  if (answer >= 32) {
    pDecoder.index++;
    answer -= 31;
    answer *= 32;
    char = pString.charAt(pDecoder.index);
    let answer2 = newCharToVal(char);
    if (answer2 >= 0 && answer2 <= 31) {
      pDecoder.index++;
      return answer + answer2;
    } else {
      throw new Error();
    }
  } else {
    pDecoder.index++;
    return answer;
  }
}

// pDecoder = item with a property "index"
// pDecoder = {index : 0}
// successive uses of stringToVal127("36+5", pDecoder) returns 3 (for "3"), 6 (for "6") and 69 (for "+5")
function stringToVal127OrInfinite(pString, pDecoder) {
  if (pString.charAt(pDecoder.index) === EXTENSION_MARK) {
    pDecoder.index += 2;
    return 64 + oldCharToVal(pString.charAt(pDecoder.index - 1));
  } else if (pString.charAt(pDecoder.index) === INFINITE_SYMBOL) {
    pDecoder.index++;
    return NUMBER_THAT_MEANS_INFINITE;
  } else {
    pDecoder.index++;
    return oldCharToVal(pString.charAt(pDecoder.index - 1));
  }
}

function stringToVal4095(pChar1, pChar2) {
  return oldCharToVal(pChar1) * 64 + oldCharToVal(pChar2);
}

export function loadLevelForEditorPreviousSystem(pLevelData) {
  let x, y;
  let gridF = [];
  let gridM = [];
  let xFirst = oldCharToVal(pLevelData.charAt(0));
  let yFirst = oldCharToVal(pLevelData.charAt(1));
  let xLast = oldCharToVal(pLevelData.charAt(2));
  let yLast = oldCharToVal(pLevelData.charAt(3));
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

const POSSIBLE_ERRORS = {
  WINDOW: 0,
  BIT: 1,
  BINARY: 2,
  COLOURS: 3,
};

export function loadLevelForEditorNewSystem(pLevelData) {
  let errorLevel = POSSIBLE_ERRORS.WINDOW;
  let decoder = { index: 5 };

  try {
    let x, y;
    let gridF = [];
    let gridM = [];
    let xFirst = newCharToVal(pLevelData.charAt(0));
    let yFirst = newCharToVal(pLevelData.charAt(1));
    let xLast = newCharToVal(pLevelData.charAt(2));
    let yLast = newCharToVal(pLevelData.charAt(3));

    errorLevel = POSSIBLE_ERRORS.BIT;
    let beWall = false;
    if (pLevelData.charAt(4) === "0") {
      beWall = false;
    } else if (pLevelData.charAt(4) === "1") {
      beWall = true;
    } else {
      throw new Error();
    }
    errorLevel = POSSIBLE_ERRORS.BINARY;

    // Grille vide
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
    // Murs / vide
    let countLeft = stringBase32ToVal(pLevelData, decoder);
    for (y = yFirst; y <= yLast; y++) {
      for (x = xFirst; x <= xLast; x++) {
        if (countLeft === 0) {
          countLeft = stringBase32ToVal(pLevelData, decoder); // decoder.index should go up by 1 or 2...
          beWall = !beWall;
        }
        gridF[y][x] = beWall ? SPACE.WALL : SPACE.EMPTY;
        countLeft--;
      }
    }
    if (countLeft > 0) {
      console.log(
        "Attention : incohérence dans les données binaires ! ..." +
          pLevelData.substring(
            decoder.index - 5,
            Math.min(pLevelData.length, decoder.index + 6),
          ),
      );
    }
    errorLevel = POSSIBLE_ERRORS.COLOURS;
    let movesInfinite = NEW_ARRAY_MOVES_INFINITE();
    let movesLimit = NEW_ARRAY_MOVES_LIMIT();
    let movesSuperLimit = NEW_ARRAY_MOVES_LIMIT();
    let type = 0;
    let count = 0;
    let xx, yy;
    while (decoder.index < pLevelData.length) {
      // TYpe
      type = MASTER_STRING_TYPES.indexOf(pLevelData.charAt(decoder.index));
      if (type === -1 || movesSuperLimit[type] > 0 || movesLimit[type]) {
        throw new Error();
      } else {
        decoder.index++;
        // Limites coups
        movesLimit[type] = stringBase32ToVal(pLevelData, decoder);
        if (movesLimit[type] === NUMBER_THAT_MEANS_INFINITE) {
          movesLimit[type] = 0;
          movesInfinite[type] = true;
        }
        movesSuperLimit[type] = stringBase32ToVal(pLevelData, decoder);
        // Blocs
        xx = 0;
        yy = 0;
        while (pLevelData.charAt(decoder.index) !== SPLIT_TOKEN) {
          count = stringBase32ToVal(pLevelData, decoder);
          xx += count;
          while (xx >= xLast - xFirst + 1) {
            xx -= xLast - xFirst + 1;
            yy++;
          }
          x = xx + xFirst;
          y = yy + yFirst;
          gridM[y][x] = BLOCK_TYPES_LIST[type].block;
        }
        decoder.index++;
        // Cibles
        xx = 0;
        yy = 0;
        while (pLevelData.charAt(decoder.index) !== SPLIT_TOKEN) {
          count = stringBase32ToVal(pLevelData, decoder);
          xx += count;
          while (xx >= xLast - xFirst + 1) {
            xx -= xLast - xFirst + 1;
            yy++;
          }
          x = xx + xFirst;
          y = yy + yFirst;
          gridF[y][x] = BLOCK_TYPES_LIST[type].goal;
        }
        decoder.index++;
      }
    }

    return {
      gridF: gridF,
      gridM: gridM,
      movesInfinite: movesInfinite,
      movesLimit: movesLimit,
      movesSuperLimit: movesSuperLimit,
    };
  } catch (error) {
    if (!pLevelData || !pLevelData.length) {
      throw new Error("Données inconnues ?");
    }
    if (errorLevel === POSSIBLE_ERRORS.WINDOW) {
      throw new Error(
        "Erreur dans le décodage de la fenêtre : " + pLevelData.substring(0, 5),
      );
    }
    if (errorLevel === POSSIBLE_ERRORS.BIT) {
      throw new Error(
        "Erreur dans le décodage du bit de départ : " +
          pLevelData.substring(0, 5),
      );
    }
    if (errorLevel === POSSIBLE_ERRORS.BINARY) {
      throw new Error(
        "Erreur dans le décodage de la partie binaire : ..." +
          pLevelData.substring(
            decoder.index - 5,
            Math.min(pLevelData.length, decoder.index + 6),
          ),
      );
    }
    if (errorLevel === POSSIBLE_ERRORS.COLOURS) {
      throw new Error(
        "Erreur dans le décodage de la partie des couleurs : ..." +
          pLevelData.substring(
            decoder.index - 5,
            Math.min(pLevelData.length, decoder.index + 6),
          ),
      );
    }
  }
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

  const dataWindow =
    valToChar(xFirst) + valToChar(yFirst) + valToChar(xLast) + valToChar(yLast);
  let currentBit = pGridF[yFirst][xFirst] === SPACE.WALL;
  let dataFirstBit = currentBit ? "1" : "0";
  let currentCount = 0;
  let dataBinary = "";
  // Etude des bits : combien de murs ? Combien de cases non murs ?
  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      if ((pGridF[y][x] === SPACE.WALL) === currentBit) {
        currentCount++;
      } else {
        dataBinary += valToBase32Str(currentCount);
        currentCount = 1;
        currentBit = !currentBit;
      }
      // A ce stade, currentCount = nombre de cases mur/non mur consécutives en cours, incluant celle-ci.
    }
  }
  dataBinary += valToBase32Str(currentCount);
  // Pour chacune des 6 couleurs (A,B,C,D,E,F), faire une 'chaine couleur' ainsi :
  // (type)(limite)(superlimite)(chaine blocs);(chaine cibles);
  // (chaine blocs) : Pour chaque bloc, donner la position (relative par rapport au point de départ du cadre)
  // (chaine cibles) : idem
  let dataColours = "";
  let dataBlocksCurrent, dataTargetsCurrent;
  let countSinceLast;
  let wantedBlock;
  let dataLim;
  for (let type = 0; type < 6; type++) {
    countSinceLast = 0;
    dataBlocksCurrent = "";
    dataTargetsCurrent = "";

    wantedBlock = MASTER_STRING_TYPES[type];
    dataLim =
      (pMovesInfinite[type]
        ? INFINITE_SYMBOL
        : valToBase32Str(pMovesLimit[type])) +
      valToBase32Str(pMovesSuperLimit[type]);

    // Blocs
    for (y = yFirst; y <= yLast; y++) {
      for (x = xFirst; x <= xLast; x++) {
        if (pGridM[y][x] === wantedBlock) {
          dataBlocksCurrent += valToBase32Str(countSinceLast);
          countSinceLast = 1;
        } else {
          countSinceLast++;
        }
      }
    }
    // Cibles
    countSinceLast = 0;
    for (y = yFirst; y <= yLast; y++) {
      for (x = xFirst; x <= xLast; x++) {
        if (pGridF[y][x] === wantedBlock) {
          dataTargetsCurrent += valToBase32Str(countSinceLast);
          countSinceLast = 1;
        } else {
          countSinceLast++;
        }
      }
    }
    if (dataBlocksCurrent.length > 0 || dataTargetsCurrent.length > 0) {
      dataColours +=
        MASTER_STRING_TYPES[type] +
        dataLim +
        dataBlocksCurrent +
        SPLIT_TOKEN +
        dataTargetsCurrent +
        SPLIT_TOKEN;
    }
  }
  return dataWindow + dataFirstBit + dataBinary + dataColours;
}
