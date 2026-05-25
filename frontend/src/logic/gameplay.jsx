import {
  MOVES,
  NO_ID_BLOCK,
  SPACE,
  REAL_XLENGTH,
  REAL_YLENGTH,
  CLEAR,
  stringMeansBlock,
  blockFamilyFromStr,
  spaceFamilyFromStr,
  isSteelFromStr,
} from "./constants.jsx";

import { useContext, useEffect } from "react";
import { LevelPlayContext } from "../context/LevelPlayContext.jsx";
import { LevelEditContext } from "../context/LevelEditContext.jsx";

// ===================
// Logic to charge a level

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
      uce.state.movesSuperLimit,
      ucp.dispatch,
    );
  }, [
    uce.state.gridF,
    uce.state.gridM,
    uce.state.movesLimit,
    uce.state.movesInfinite,
    uce.state.movesSuperLimit,
    ucp.dispatch,
  ]);
}

function startLevelFromGrid(
  pGridFFromEditor,
  pGridMFromEditor,
  pMovesLimit,
  pMovesInfinite,
  pMovesSuperLimit,
  pDispatchPlay,
) {
  const gridF = [];
  const gridM = [];
  const itemsInGrid = [];
  let id, blockFamily;
  const blockFamilies = [];
  const before_rows = 0; //Math.floor(REAL_YLENGTH - rawLevel.length) / 2;
  const before_columns = 0; //Math.floor(REAL_XLENGTH - rawLevel[1].length) / 2;
  const blockFamiliesInfos = [];

  pDispatchPlay({ type: "clear", clear: CLEAR.NO });

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
      if (stringMeansBlock(pGridMFromEditor[y][x])) {
        blockFamily = blockFamilyFromStr(pGridMFromEditor[y][x]);
        gridF[y][x] = pGridFFromEditor[y][x];
        id = itemsInGrid.length;

        itemsInGrid.push({
          blockFamily: blockFamily,
          block: pGridMFromEditor[y][x],
          isSteel: isSteelFromStr(pGridMFromEditor[y][x]),
          x: x,
          y: y,
          id: id,
          movedThisTime: false,
        });
        gridM[y][x] = id;

        // Is it a block type not yet seen in this level ?
        let i = 0;
        for (i = 0; i < blockFamilies.length; i++) {
          if (blockFamilies[i] === blockFamily) {
            break;
          }
        }
        if (i === blockFamilies.length) {
          blockFamiliesInfos[blockFamily] = {
            index: blockFamilies.length,
            movesPlayed: 0,
            movesLimit: pMovesLimit[blockFamily],
            movesSuperLimit: pMovesSuperLimit[blockFamily],
            movesInfinite: pMovesInfinite[blockFamily],
          }; // Where element of "blockFamiliesInfos" are set
          blockFamilies.push(blockFamily);
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
    type: "currentBlockFamilyID",
    currentBlockFamilyID: 0,
  });
  pDispatchPlay({
    type: "blockFamilies",
    blockFamilies: blockFamilies,
  });
  pDispatchPlay({
    type: "blockFamiliesInfos",
    blockFamiliesInfos: blockFamiliesInfos,
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

  // Supposes that px,py is a block. (id defined)
  function steelInSpace(px, py) {
    return state.itemsInGrid[state.gridM[py][px]].isSteel;
  }
  function familyInSpace(px, py) {
    return state.itemsInGrid[state.gridM[py][px]].blockFamily;
  }

  function moveBlocks(pDirection) {
    let gridM = state.gridM;
    let gridF = state.gridF;

    let itemsInGrid = state.itemsInGrid;
    let moves = state.moves;
    let currentBlockFamily = state.blockFamilies[state.currentBlockFamilyID];

    let x, y, x2, y2, x3, y3;
    let item;

    let noSameBlockBehind, xBeh, yBeh;
    let movePerformed = false;

    moves.push({ direction: pDirection, newPosBlocks: [] });

    itemsInGrid.forEach((itemInGrid) => {
      if (itemInGrid.blockFamily === currentBlockFamily) {
        x = itemInGrid.x;
        y = itemInGrid.y;
        x2 = x + MOVES[pDirection].dx;
        y2 = y + MOVES[pDirection].dy;

        while (
          gridM[y2][x2] !== NO_ID_BLOCK &&
          (familyInSpace(x2, y2) === currentBlockFamily ||
            !steelInSpace(x2, y2))
        ) {
          x2 += MOVES[pDirection].dx;
          y2 += MOVES[pDirection].dy;
        }
        // Right now, either gridF[y2][x2] is uncrossable (wall / steel of a different colour / ?) or gridM[y2][x2] has no blocks. Let's assume it's the second, which means we can push all the blocks.
        if (
          gridF[y2][x2] !== SPACE.WALL &&
          (gridM[y2][x2] === NO_ID_BLOCK ||
            familyInSpace(x2, y2) === currentBlockFamily ||
            !steelInSpace(x2, y2))
        ) {
          // We need an extra check to make sure there is no block of the same type behind that is ready to push !
          // Note : a steel from another type interrupts the chain !
          noSameBlockBehind = true;
          xBeh = x - MOVES[pDirection].dx;
          yBeh = y - MOVES[pDirection].dy;
          while (
            noSameBlockBehind &&
            gridM[yBeh][xBeh] !== NO_ID_BLOCK &&
            (familyInSpace(xBeh, yBeh) === currentBlockFamily ||
              !steelInSpace(xBeh, yBeh))
          ) {
            noSameBlockBehind =
              state.itemsInGrid[gridM[yBeh][xBeh]].blockFamily !==
              currentBlockFamily;
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
      moves[moves.length - 1].blockFamily = currentBlockFamily;
      dispatch({
        type: "blockFamilyPlayedPlus1",
        blockFamily: currentBlockFamily,
      });
      movePerformed = true;
    }
    dispatch({
      type: "levelState",
      moves: moves,
      itemsInGrid: itemsInGrid,
      gridM: gridM,
    });

    return movePerformed;
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
        type: "blockFamilyPlayedMinus1",
        blockFamily: moveToUndo.blockFamily,
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
      uce.state.movesSuperLimit,
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
      if (spaceFamilyFromStr(state.gridF[y][x]) !== item.blockFamily) {
        return CLEAR.NO;
      }
    }
    let clearStatus = CLEAR.TOTAL;
    let blockFamily;
    for (let i = 0; i < state.blockFamilies.length; i++) {
      blockFamily = state.blockFamilies[i];
      if (
        !state.blockFamiliesInfos[blockFamily].movesInfinite &&
        state.blockFamiliesInfos[blockFamily].movesPlayed >
          state.blockFamiliesInfos[blockFamily].movesLimit
      ) {
        return CLEAR.NO;
      }
      if (
        state.blockFamiliesInfos[blockFamily].movesPlayed >
        state.blockFamiliesInfos[blockFamily].movesSuperLimit
      ) {
        clearStatus = CLEAR.PARTIAL;
      }
    }

    return clearStatus;
  }

  // -------------------
  // The informations

  function getBlockFamilies() {
    return state.blockFamilies;
  }

  function setCurrentBlockFamily(pblockFamily) {
    dispatch({
      type: "currentBlockFamilyID",
      currentBlockFamilyID: state.blockFamiliesInfos[pblockFamily].index,
    });
  }

  function getCurrentBlockFamily() {
    return state.blockFamilies[state.currentBlockFamilyID];
  }

  function getMovesPlayed(pblockFamily) {
    return state.blockFamiliesInfos[pblockFamily].movesPlayed;
  }

  function getMovesLimit(pblockFamily) {
    return state.blockFamiliesInfos[pblockFamily].movesLimit;
  }

  function areMovesInfinite(pblockFamily) {
    return state.blockFamiliesInfos[pblockFamily].movesInfinite;
  }

  return {
    moveBlocks,
    undo,
    restart,
    checkClearConditions,
    getBlockFamilies,
    getCurrentBlockFamily,
    getMovesPlayed,
    getMovesLimit,
    areMovesInfinite,
    setCurrentBlockFamily,
  };
}
