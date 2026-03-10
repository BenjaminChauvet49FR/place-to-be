import {
  MOVES,
  BLOCK,
  NO_ID_BLOCK,
  SPACE,
  REAL_XLENGTH,
  REAL_YLENGTH,
} from "./constants.jsx";

// ===================
// Logic to charge a level

function isBlock(pChar) {
  return pChar === BLOCK.A || pChar === BLOCK.B || pChar === BLOCK.C;
}

export function startLevelFromGrid(
  pGridFFromEditor,
  pGridMFromEditor,
  pDispatchPlay,
) {
  const gridF = [];
  const gridM = [];
  const itemsInGrid = [];
  let id, blockType;
  const blockTypes = [];
  const before_rows = 0; //Math.floor(REAL_YLENGTH - rawLevel.length) / 2;
  const before_columns = 0; //Math.floor(REAL_XLENGTH - rawLevel[1].length) / 2;

  let y = 0;
  let x;
  let xRef, yRef;
  for (; y < before_rows; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < REAL_XLENGTH; x++) {
      gridF[y].push(SPACE.EMPTY);
      gridM[y].push(NO_ID_BLOCK);
    }
  }
  yRef = y;
  //for (; y < before_rows + rawLevel.length - 1; y++) {
  for (; y < before_rows + pGridFFromEditor.length; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < before_columns; x++) {
      gridF[y].push(SPACE.EMPTY);
      gridM[y].push(NO_ID_BLOCK);
    }
    xRef = x;
    //for (; x < before_columns + rawLevel[y - yRef + 1].length; x++) {
    for (; x < before_columns + pGridFFromEditor[y - yRef].length; x++) {
      //gridF[y].push(rawLevel[y - yRef + 1].charAt(x - xRef));
      gridF[y].push(pGridFFromEditor[y - yRef][x - xRef]);
      gridM[y].push(NO_ID_BLOCK);
      if (isBlock(pGridMFromEditor[y][x])) {
        blockType = pGridMFromEditor[y][x];
        gridF[y][x] = SPACE.EMPTY;
        id = itemsInGrid.length;
        itemsInGrid.push({
          blockType: blockType,
          x: x,
          y: y,
          id: itemsInGrid.length,
          movedThisTime: false,
        });
        gridM[y][x] = id;
        let i = 0;
        for (i = 0; i < blockTypes.length; i++) {
          if (blockTypes[i] === blockType) {
            break;
          }
        }
        if (i === blockTypes.length) {
          blockTypes.push(blockType);
        }
      }
    }
    for (; x < REAL_XLENGTH; x++) {
      gridF[y].push(SPACE.EMPTY);
      gridM[y].push(NO_ID_BLOCK);
    }
  }
  for (; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < REAL_XLENGTH; x++) {
      gridF[y].push(SPACE.EMPTY);
      gridM[y].push(NO_ID_BLOCK);
    }
  }
  pDispatchPlay({ type: "gridF_ALL", gridF: gridF });
  pDispatchPlay({
    type: "levelState",
    moves: [],
    itemsInGrid: itemsInGrid,
    gridM: gridM,
  });
  pDispatchPlay({
    type: "currentBlockTypeID",
    currentBlockTypeID: 0,
  });
  pDispatchPlay({
    type: "blockTypes",
    blockTypes: blockTypes,
  });
}

// ===================
// Logic WITHIN the level

export function moveBlocks(pDirection, pState, pDispatch) {
  let gridM = pState.gridM;
  let gridF = pState.gridF;

  let itemsInGrid = pState.itemsInGrid;
  let moves = pState.moves;
  let currentBlockType = pState.blockTypes[pState.currentBlockTypeID];

  let x, y, x2, y2, x3, y3;
  let item;

  let noSameBlockBehind, xBeh, yBeh;

  moves.push({ direction: pDirection, newPosBlocks: [] });

  itemsInGrid.forEach((itemInGrid) => {
    if (itemInGrid.blockType === currentBlockType) {
      x = itemInGrid.x;
      y = itemInGrid.y;
      x2 = x + MOVES[pDirection].dx;
      y2 = y + MOVES[pDirection].dy;
      while (gridF[y2][x2] !== SPACE.WALL && gridM[y2][x2] !== NO_ID_BLOCK) {
        x2 += MOVES[pDirection].dx;
        y2 += MOVES[pDirection].dy;
      }
      // Right now, either gridF[y2][x2] is uncrossable or gridM[y2][x2] has no blocks. Let's assume it's the second.
      if (gridF[y2][x2] !== SPACE.WALL) {
        // We need an extra check to make sure there is no block of the same type behind that is ready to push !
        noSameBlockBehind = true;
        xBeh = x - MOVES[pDirection].dx;
        yBeh = y - MOVES[pDirection].dy;
        while (noSameBlockBehind && gridM[yBeh][xBeh] !== NO_ID_BLOCK) {
          noSameBlockBehind =
            pState.itemsInGrid[gridM[yBeh][xBeh]].blockType !==
            currentBlockType;
          xBeh -= MOVES[pDirection].dx;
          yBeh -= MOVES[pDirection].dy;
        }
        if (noSameBlockBehind) {
          // Great ! The last block of that colour in the queue is being pushed.
          // So... backtrack (spaces are moved from x3,y3 to x2,y2) until (x3,y3) === (x,y) included
          x3 = x2;
          y3 = y2;
          do {
            x3 -= MOVES[pDirection].dx;
            y3 -= MOVES[pDirection].dy;
            /*gridM[y2][x2] = gridM[y3][x3];
						gridM[y3][x3] = -1;*/ // BUG SPOTTED ! If these moves are performed too early, with the 'last block of that colour in the queue', here's what happens : o.o. (moving right) : .oo. (and the second o is considered "not the last block of the queue". This is why we need to perform all moves simultaneously at the end...
            item = itemsInGrid[gridM[y3][x3]];
            item.x = x2;
            item.y = y2;
            moves[moves.length - 1].newPosBlocks.push({
              xLeft: x3,
              yLeft: y3,
              xDest: x2,
              yDest: y2,
              id: item.id,
            });
            pState.itemsInGrid[item.id].x = x2;
            pState.itemsInGrid[item.id].y = y2;
            x2 = x3;
            y2 = y3;
          } while (x3 !== x || y3 !== y);
        }
      }
    }
  });
  if (moves[moves.length - 1].newPosBlocks.length === 0) {
    moves.pop();
  } else {
    // NOW we apply the moves (and not at the "bug spotted" place above) ! And in the correct order (start of queues first : 1234. 123.4 12.34 etc...)
    moves[moves.length - 1].newPosBlocks.forEach((npb) => {
      gridM[npb.yLeft][npb.xLeft] = NO_ID_BLOCK;
      gridM[npb.yDest][npb.xDest] = npb.id;
    });
  }
  pDispatch({
    type: "levelState",
    moves: moves,
    itemsInGrid: itemsInGrid,
    gridM: gridM,
  });
}

export function undo(pState, pDispatch) {
  if (pState.moves.length > 0) {
    let gridM = pState.gridM.map((row, y) =>
      row.map((_, x) => pState.gridM[y][x]),
    );

    let itemsInGrid = pState.itemsInGrid.map((item) => item);
    let moves = pState.moves.map((item) => item);
    itemsInGrid.sort(function (pItem1, pItem2) {
      return pItem1.id - pItem2.id;
    });
    let moveToUndo = moves.pop();
    let posToUndo;
    while (moveToUndo.newPosBlocks.length > 0) {
      posToUndo = moveToUndo.newPosBlocks.pop();
      gridM[posToUndo.yLeft][posToUndo.xLeft] = posToUndo.id;
      gridM[posToUndo.yDest][posToUndo.xDest] = NO_ID_BLOCK;
      itemsInGrid[posToUndo.id].x = posToUndo.xLeft;
      itemsInGrid[posToUndo.id].y = posToUndo.yLeft;
    }

    pDispatch({
      type: "levelState",
      moves: moves,
      itemsInGrid: itemsInGrid,
      gridM: gridM,
    });
  }
}

export function getBlockTypes(pState) {
  return pState.blockTypes;
}

export function setCurrentBlockType(pBlockType, pState, pDispatch) {
  let pIndex = pState.blockTypes.indexOf(pBlockType);
  pDispatch({ type: "currentBlockTypeID", currentBlockTypeID: pIndex });
}

export function getCurrentBlockType(pState) {
  return pState.blockTypes[pState.currentBlockTypeID];
}
