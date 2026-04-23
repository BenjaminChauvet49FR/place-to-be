import {
  MOVES,
  BLOCK,
  NO_ID_BLOCK,
  SPACE,
  REAL_XLENGTH,
  REAL_YLENGTH,
  BLOCK_INFO,
} from "./constants.jsx";

import { useContext, useEffect } from "react";
import { LevelPlayContext } from "../context/LevelPlayContext.jsx";
import { LevelEditContext } from "../context/LevelEditContext.jsx";

// ===================
// Logic to charge a level

function isBlock(pChar) {
  return pChar === BLOCK.A || pChar === BLOCK.B || pChar === BLOCK.C;
}

function defaultRowFill(pRowF, pRowM) {
  pRowF.push(SPACE.EMPTY);
  pRowM.push(NO_ID_BLOCK);
}

export function useStartLevelFromGrid() {
  const ucp = useContext(LevelPlayContext);
  const uce = useContext(LevelEditContext);

  useEffect(() => {
    startLevelFromGrid(
      uce.state.gridF,
      uce.state.gridM,
      uce.state.movesLimit,
      uce.state.movesInfinite,
      ucp.dispatch,
    );
  }, [
    uce.state.gridF,
    uce.state.gridM,
    uce.state.movesLimit,
    uce.state.movesInfinite,
    ucp.dispatch,
  ]);
}

function startLevelFromGrid(
  pGridFFromEditor,
  pGridMFromEditor,
  pMovesLimit,
  pMovesInfinite,
  pDispatchPlay,
) {
  const gridF = [];
  const gridM = [];
  const itemsInGrid = [];
  let id, blockType;
  const blockTypes = [];
  const before_rows = 0; //Math.floor(REAL_YLENGTH - rawLevel.length) / 2;
  const before_columns = 0; //Math.floor(REAL_XLENGTH - rawLevel[1].length) / 2;
  const blockTypesInfos = [];

  pDispatchPlay({ type: "clear", clear: false });

  let y = 0;
  let x;
  let xRef, yRef;
  for (; y < before_rows; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < REAL_XLENGTH; x++) {
      defaultRowFill(gridF[y], gridM[y]);
    }
  }
  yRef = y;

  for (; y < before_rows + pGridFFromEditor.length; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < before_columns; x++) {
      defaultRowFill(gridF[y], gridM[y]);
    }
    xRef = x;
    for (; x < before_columns + pGridFFromEditor[y - yRef].length; x++) {
      gridF[y].push(pGridFFromEditor[y - yRef][x - xRef]);
      gridM[y].push(NO_ID_BLOCK);
      if (isBlock(pGridMFromEditor[y][x])) {
        blockType = pGridMFromEditor[y][x];
        gridF[y][x] = pGridFFromEditor[y][x];
        id = itemsInGrid.length;

        itemsInGrid.push({
          blockType: blockType,
          x: x,
          y: y,
          id: id,
          movedThisTime: false,
        });
        gridM[y][x] = id;

        // Is it a block type not yet seen in this level ?
        let i = 0;
        for (i = 0; i < blockTypes.length; i++) {
          if (blockTypes[i] === blockType) {
            break;
          }
        }
        if (i === blockTypes.length) {
          blockTypesInfos[blockType] = {
            index: blockTypes.length,
            movesPlayed: 0,
            movesLimit: pMovesLimit[BLOCK_INFO[blockType].id],
            movesInfinite: pMovesInfinite[BLOCK_INFO[blockType].id],
          }; // Where element of "blockTypesInfos" are set
          blockTypes.push(blockType);
        }
      }
    }
    for (; x < REAL_XLENGTH; x++) {
      defaultRowFill(gridF[y], gridM[y]);
    }
  }
  for (; y < REAL_YLENGTH; y++) {
    gridF.push([]);
    gridM.push([]);
    x = 0;
    for (; x < REAL_XLENGTH; x++) {
      defaultRowFill(gridF[y], gridM[y]);
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
  pDispatchPlay({
    type: "blockTypesInfos",
    blockTypesInfos: blockTypesInfos,
  });
}

// ===================
// Logic WITHIN the level

export function useGameplay() {
  const playContext = useContext(LevelPlayContext);
  const uce = useContext(LevelEditContext);

  const { state, dispatch } = playContext;

  // -------------------
  // The moves

  function moveBlocks(pDirection) {
    let gridM = state.gridM;
    let gridF = state.gridF;

    let itemsInGrid = state.itemsInGrid;
    let moves = state.moves;
    let currentBlockType = state.blockTypes[state.currentBlockTypeID];

    let x, y, x2, y2, x3, y3;
    let item;

    let noSameBlockBehind, xBeh, yBeh;
    let movePerformed = false;

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
              state.itemsInGrid[gridM[yBeh][xBeh]].blockType !==
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
              state.itemsInGrid[item.id].x = x2;
              state.itemsInGrid[item.id].y = y2;
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
      moves[moves.length - 1].blockType = currentBlockType;
      dispatch({ type: "blockTypePlayedPlus1", blockType: currentBlockType });
      movePerformed = true;
    }
    dispatch({
      type: "levelState",
      moves: moves,
      itemsInGrid: itemsInGrid,
      gridM: gridM,
    });

    // Fait un peu tôt MAIS le fait que "l'attente" (un window.alert ou un message d'API) soit juste avant le tout dernier déplacement n'est pas idiot en soi. Ca va me rappeler l'heurese époque de Django ;)
    if (!state.clear && movePerformed && checkClearConditions()) {
      window.alert("C'est gagné ;)");
      dispatch({ type: "clear", clear: true });
    }
  }

  function undo() {
    if (state.moves.length > 0) {
      let gridM = state.gridM.map((row, y) =>
        row.map((_, x) => state.gridM[y][x]),
      );

      let itemsInGrid = state.itemsInGrid.map((item) => item);
      let moves = state.moves.map((item) => item);
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

      dispatch({
        type: "blockTypePlayedMinus1",
        blockType: moveToUndo.blockType,
      });
      dispatch({
        type: "levelState",
        moves: moves,
        itemsInGrid: itemsInGrid,
        gridM: gridM,
      });
    }
  }

  function restart() {
    startLevelFromGrid(
      uce.state.gridF,
      uce.state.gridM,
      uce.state.movesLimit,
      uce.state.movesInfinite,
      dispatch,
    );
  }

  // ------------------
  // The win conditions
  function checkClearConditions() {
    let item = null;
    let x, y;
    for (let i = 0; i < state.itemsInGrid.length; i++) {
      item = state.itemsInGrid[i];
      x = item.x;
      y = item.y;
      if (state.gridF[y][x] !== item.blockType) {
        return false;
      }
    }
    return true;
  }

  // -------------------
  // The informations

  function getBlockTypes() {
    return state.blockTypes;
  }

  function setCurrentBlockType(pBlockType) {
    dispatch({
      type: "currentBlockTypeID",
      currentBlockTypeID: state.blockTypesInfos[pBlockType].index,
    });
  }

  function getCurrentBlockType() {
    return state.blockTypes[state.currentBlockTypeID];
  }

  function getMovesPlayed(pBlockType) {
    return state.blockTypesInfos[pBlockType].movesPlayed;
  }

  function getMovesLimit(pBlockType) {
    return state.blockTypesInfos[pBlockType].movesLimit;
  }

  function areMovesInfinite(pBlockType) {
    return state.blockTypesInfos[pBlockType].movesInfinite;
  }

  return {
    moveBlocks,
    undo,
    restart,
    getBlockTypes,
    getCurrentBlockType,
    getMovesPlayed,
    getMovesLimit,
    areMovesInfinite,
    setCurrentBlockType,
  };
}
