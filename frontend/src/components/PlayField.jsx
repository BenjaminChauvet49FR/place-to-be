import {
  SPACE,
  SPACE_INFO,
  BLOCK,
  BLOCK_INFO,
  NO_ID_BLOCK,
  SUPERPOSITION_CORRECT,
  SUPERPOSITION_NONE,
  SUPERPOSITION_WRONG,
} from "../logic/constants.jsx";
import "../styles/style.css";

import { useContext } from "react";
import { LevelPlayContext } from "../context/LevelPlayContext.jsx";

export default function Component() {
  const lpc = useContext(LevelPlayContext);
  const state = lpc.state;
  const itemsInGrid = state.itemsInGrid;
  const xLength = state.gridF[0].length;
  const yLength = state.gridF.length;

  function getClassName(pX, pY) {
    if (state.gridM[pY][pX] === NO_ID_BLOCK) {
      switch (state.gridF[pY][pX]) {
        case SPACE.GOAL_A:
        case SPACE.GOAL_B:
        case SPACE.GOAL_C:
        case SPACE.WALL:
        case SPACE.EMPTY:
          return SPACE_INFO[state.gridF[pY][pX]].className;
        default:
          console.log("Grille fixe");
          console.log(pX + "," + pY);
          console.log(state.gridF);
          window.alert(
            "Attention, erreur de className sur case sans bloc (PlayField) " +
              state.gridF[pY][pX] +
              "," +
              state.gridM[pY][pX],
          );
          return 1 / 0;
      }
    } else {
      let blocktype = itemsInGrid[state.gridM[pY][pX]].blockType;
      switch (blocktype) {
        case BLOCK.A:
        case BLOCK.B:
        case BLOCK.C:
          return BLOCK_INFO[blocktype].className;
        default:
          console.log("Grille mobile");
          console.log(pX + "," + pY);
          console.log(state.gridF);
          window.alert(
            "Attention, erreur de className sur bloc présent ! (PlayField) " +
              state.gridF[pY][pX] +
              "," +
              state.gridM[pY][pX],
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
      return SUPERPOSITION_NONE;
    }
    if (state.gridF[pY][pX] === itemsInGrid[state.gridM[pY][pX]].blockType) {
      return SUPERPOSITION_CORRECT;
    } else {
      return SUPERPOSITION_WRONG(state.gridF[pY][pX]);
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
