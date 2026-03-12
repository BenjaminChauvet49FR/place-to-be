import { SPACE, BLOCK, NO_ID_BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";

import { useContext } from "react";
import { LevelPlayContext } from "../context/LevelPlayContext.jsx";

function PlayField() {
  const lpc = useContext(LevelPlayContext);
  const state = lpc.state;
  const itemsInGrid = state.itemsInGrid;
  const xLength = state.gridF[0].length;
  const yLength = state.gridF.length;

  function getClassName(pX, pY) {
    if (state.gridM[pY][pX] === NO_ID_BLOCK) {
      switch (state.gridF[pY][pX]) {
        case SPACE.GOAL_A:
          return "space_goalA";
        case SPACE.GOAL_B:
          return "space_goalB";
        case SPACE.GOAL_C:
          return "space_goalC";
        case SPACE.WALL:
          return "space_wall";
        case SPACE.EMPTY:
          return "space_empty";
        default:
          window.alert(
            "Attention, erreur de className sur NO_ID_BLOCK ! (PlayField)",
          );
          return 1 / 0;
      }
    } else {
      switch (itemsInGrid[state.gridM[pY][pX]].blockType) {
        case BLOCK.A:
          return "space_blockA";
        case BLOCK.B:
          return "space_blockB";
        case BLOCK.C:
          return "space_blockC";
        default:
          window.alert(
            "Attention, erreur de className sur bloc présent ! (PlayField)",
          );
          return 1 / 0;
      }
    }
  }

  function classSuperposition(pX, pY) {
    if (
      state.gridF[pY][pX] === SPACE.EMPTY ||
      state.gridM[pY][pX] === NO_ID_BLOCK
    ) {
      return "superposition none";
    }
    if (state.gridF[pY][pX] === itemsInGrid[state.gridM[pY][pX]].blockType) {
      return "superposition correct";
    } else {
      return "superposition wrong_" + state.gridF[pY][pX];
    }
  }

  return (
    <div className="playField mainComponent">
      {Array.from({ length: yLength }).map((_, y) => (
        <div key={y} className="spaceRow">
          {Array.from({ length: xLength }).map((_, x) => (
            <div key={x} className={`space ${getClassName(x, y)}`}>
              {" "}
              <div className={classSuperposition(x, y)}></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PlayField;
