import {
  NEW_ARRAY_MOVES_INFINITE,
  NEW_ARRAY_MOVES_LIMIT,
  REAL_XLENGTH,
  REAL_YLENGTH,
  SPACE,
  BLOCK,
  TYPE,
  BLOCK_FAMILIES,
  blockFamilyFromStr,
  isSteelFromStr,
} from "./constants.jsx";

// Note : we assume all parameters passed are fine in the use of enconding and decoding functions
const MASTER_STRING =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&$";
const MASTER_STRING_FAMILIES = "ABCDEF";

const INFINITE_SYMBOL = "-";
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

/** For numbers 0 to 1023 */
function valToBase32Str(pVal) {
  if (pVal <= 31) {
    return MASTER_STRING[pVal];
  } else {
    return MASTER_STRING[31 + Math.floor(pVal / 32)] + MASTER_STRING[pVal % 32];
  }
  // 31 v ; 32-63 w0-wv ; 64-95 x0-xv ...
}

// See below ; pDecoder = {index : ...}
function stringBase32ToVal(pString, pDecoder) {
  let char = pString.charAt(pDecoder.index);
  let answer = charToVal(char);
  if (answer >= 32) {
    pDecoder.index++;
    answer -= 31;
    answer *= 32;
    char = pString.charAt(pDecoder.index);
    let answer2 = charToVal(char);
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

const POSSIBLE_ERRORS = {
  WINDOW: 0,
  BIT: 1,
  BINARY: 2,
  COLOURS: 3,
};

const INDEX_OF_STEEL = 1;
const INDEX_OF_NONE = 0;
const INDEX_OF_TARGETS = 2;

export function loadLevelForEditorPreviousSystem(pLevelData) {
  let errorLevel = POSSIBLE_ERRORS.WINDOW;
  let decoder = { index: 5 };

  try {
    let x, y;
    let gridF = [];
    let gridM = [];
    let xFirst = charToVal(pLevelData.charAt(0));
    let yFirst = charToVal(pLevelData.charAt(1));
    let xLast = charToVal(pLevelData.charAt(2));
    let yLast = charToVal(pLevelData.charAt(3));

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
    let family = 0;
    let count = 0;
    let xx, yy;
    while (decoder.index < pLevelData.length) {
      // Famille du bloc (A, B, C...)
      family = MASTER_STRING_FAMILIES.indexOf(pLevelData.charAt(decoder.index));
      if (family === -1 || movesSuperLimit[family] > 0 || movesLimit[family]) {
        throw new Error();
      } else {
        decoder.index++;
        // Limites coups
        movesLimit[family] = stringBase32ToVal(pLevelData, decoder);
        if (movesLimit[family] === NUMBER_THAT_MEANS_INFINITE) {
          movesLimit[family] = 0;
          movesInfinite[family] = true;
        }
        movesSuperLimit[family] = stringBase32ToVal(pLevelData, decoder);
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
          gridM[y][x] = BLOCK_FAMILIES[family].normal;
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
          gridF[y][x] = BLOCK_FAMILIES[family].normal;
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

export function loadLevelForEditorNewSystem(pLevelData) {
  let errorLevel = POSSIBLE_ERRORS.WINDOW;
  let decoder = { index: 5 };

  try {
    let x, y;
    let gridF = [];
    let gridM = [];
    let xFirst = charToVal(pLevelData.charAt(0));
    let yFirst = charToVal(pLevelData.charAt(1));
    let xLast = charToVal(pLevelData.charAt(2));
    let yLast = charToVal(pLevelData.charAt(3));

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

    // Chaque famille !
    errorLevel = POSSIBLE_ERRORS.COLOURS;
    let movesInfinite = NEW_ARRAY_MOVES_INFINITE();
    let movesLimit = NEW_ARRAY_MOVES_LIMIT();
    let movesSuperLimit = NEW_ARRAY_MOVES_LIMIT();
    let family = 0;
    let count = 0;
    let xx, yy;
    let relevantGrid, relevantElement;
    while (decoder.index < pLevelData.length) {
      // Famille du bloc (A, B, C...)
      family = MASTER_STRING_FAMILIES.indexOf(pLevelData.charAt(decoder.index));
      if (family === -1 || movesSuperLimit[family] > 0 || movesLimit[family]) {
        throw new Error();
      } else {
        decoder.index++;
        // Limites coups
        movesLimit[family] = stringBase32ToVal(pLevelData, decoder);
        if (movesLimit[family] === NUMBER_THAT_MEANS_INFINITE) {
          movesLimit[family] = 0;
          movesInfinite[family] = true;
        }
        movesSuperLimit[family] = stringBase32ToVal(pLevelData, decoder);
        // Blocs ordinaires
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
          gridM[y][x] = BLOCK_FAMILIES[family].normal;
        }
        decoder.index++;
        // Blocs acier + cibles
        while (true) {
          if (decoder.index >= pLevelData.length) {
            break;
          }
          switch (pLevelData.charAt(decoder.index)) {
            case TYPE.STEEL:
              relevantGrid = gridM;
              relevantElement = BLOCK_FAMILIES[family].steel;
              break;
            case TYPE.TARGETS:
              relevantGrid = gridF;
              relevantElement = BLOCK_FAMILIES[family].target;
              break;
            default:
              relevantGrid = null;
              break;
          }
          if (relevantGrid === null) {
            break;
          } else {
            decoder.index++;
          }
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
            relevantGrid[y][x] = relevantElement;
          }
          decoder.index++;
        }
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
  // (famille)(limite)(superlimite)(chaine blocs);(chaine cibles);
  // (chaine blocs) : Pour chaque bloc, donner la position (relative par rapport au point de départ du cadre)
  // (chaine cibles) : idem
  let dataColours = "";
  let blockFamily = 0;
  let typeIndex;
  let spacePosition;
  let dataCurrentColourLetterLimit,
    dataCurrentColourBlocks,
    dataCurrentColourTargets;

  let NB_FAMILIES = MASTER_STRING_FAMILIES.length;
  let allFamiliesLastPositions = [];
  let dataBlocksArray = [];

  for (var i = 0; i < NB_FAMILIES; i++) {
    allFamiliesLastPositions.push([0, 0, 0]);
    dataBlocksArray.push(["", "", ""]);
  }

  // TOUS les Blocs et les cibles (et leurs chaînes)
  for (y = yFirst; y <= yLast; y++) {
    for (x = xFirst; x <= xLast; x++) {
      blockFamily = blockFamilyFromStr(pGridM[y][x]);
      if (blockFamily >= 0) {
        typeIndex = isSteelFromStr(pGridM[y][x])
          ? INDEX_OF_STEEL
          : INDEX_OF_NONE;
        spacePosition = (y - yFirst) * (xLast - xFirst + 1) + x - xFirst;
        dataBlocksArray[blockFamily][typeIndex] += valToBase32Str(
          spacePosition - allFamiliesLastPositions[blockFamily][typeIndex],
        );
        allFamiliesLastPositions[blockFamily][typeIndex] = spacePosition;
      }

      blockFamily = blockFamilyFromStr(pGridF[y][x]);
      if (blockFamily >= 0) {
        spacePosition = (y - yFirst) * (xLast - xFirst + 1) + x - xFirst;
        dataBlocksArray[blockFamily][INDEX_OF_TARGETS] += valToBase32Str(
          spacePosition -
            allFamiliesLastPositions[blockFamily][INDEX_OF_TARGETS],
        );
        allFamiliesLastPositions[blockFamily][INDEX_OF_TARGETS] = spacePosition;
      }
    }
  }
  // Positionnement : une catégorie d'éléments aux positions indexées 0, 7, 13, 18 : 0765 ; une catégorie aux positions indexées 14, 15, 17, 28 : e12b ; le 1er numéro = position du 1er élément, les suivants = différences

  for (let family = 0; family < 6; family++) {
    // Lettre et limites
    dataCurrentColourLetterLimit =
      MASTER_STRING_FAMILIES[family] +
      (pMovesInfinite[family]
        ? INFINITE_SYMBOL
        : valToBase32Str(pMovesLimit[family])) +
      valToBase32Str(pMovesSuperLimit[family]);
    // Blocs naturels (pas de délimiteur entre les limites et ça, en revanche le délimiteur est indispensable juste après, même si on a zéro bloc normal)
    dataCurrentColourBlocks =
      dataBlocksArray[family][INDEX_OF_NONE] + SPLIT_TOKEN;

    // Blocs d'acier (délimiteur ici)
    if (dataBlocksArray[family][INDEX_OF_STEEL].length > 0) {
      dataCurrentColourBlocks +=
        TYPE.STEEL + dataBlocksArray[family][INDEX_OF_STEEL] + SPLIT_TOKEN;
    }
    if (dataCurrentColourBlocks.length <= 1) {
      // Note : 1 et non 0 en raison du délimiteur obligatoire après les blocs vides.
      continue;
    }
    // Cibles
    if (dataBlocksArray[family][INDEX_OF_TARGETS].length > 0) {
      dataCurrentColourTargets =
        TYPE.TARGETS + dataBlocksArray[family][INDEX_OF_TARGETS] + SPLIT_TOKEN;
    } else {
      dataCurrentColourTargets = "";
    }

    dataColours +=
      dataCurrentColourLetterLimit +
      dataCurrentColourBlocks +
      dataCurrentColourTargets;
  }
  return dataWindow + dataFirstBit + dataBinary + dataColours;
}
