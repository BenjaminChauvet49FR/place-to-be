import {
  SPACE,
  BLOCK,
  DO_NOT_CHANGE,
  SPACE_INFO,
  BLOCK_INFO,
  SUPERPOSITION_CORRECT,
  SUPERPOSITION_NONE,
  SUPERPOSITION_WRONG,
  canChangeSpace,
} from "../logic/constants.jsx";
import "../styles/style.css";
import { useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";

export default function Component({ loadingPackage }) {
  const { state, dispatch } = useContext(LevelEditContext);
  const xLength = state.gridF[0].length;
  const yLength = state.gridF.length;

  function getClassName(pX, pY) {
    if (state.gridM[pY][pX] !== BLOCK.NONE) {
      switch (state.gridM[pY][pX]) {
        case BLOCK.A:
        case BLOCK.B:
        case BLOCK.C:
          return BLOCK_INFO[state.gridM[pY][pX]].className;
        default:
          console.log("Grille mobile");
          console.log(pX + "," + pY);
          console.log(state.gridM);
          window.alert(
            "Attention, erreur de className, cf. EditorPanel ! (EditorField) " +
              state.gridF[pY][pX] +
              "," +
              state.gridM[pY][pX],
          );
          return 1 / 0;
      }
    } else {
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
            "Attention, erreur de className, cf. EditorPanel ! (EditorField) " +
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
      state.gridM[pY][pX] === BLOCK.NONE
    ) {
      return SUPERPOSITION_NONE;
    }
    if (state.gridF[pY][pX] === state.gridM[pY][pX]) {
      return SUPERPOSITION_CORRECT;
    } else {
      return SUPERPOSITION_WRONG(state.gridF[pY][pX]);
    }
  }

  return (
    <div className="mainComponent">
      {loadingPackage.isLoading ? (
        <div>Chargement en cours...</div>
      ) : (
        <div>
          {Array.from({ length: yLength }).map((_, y) => (
            <div key={y} className="spaceRow">
              {Array.from({ length: xLength }).map((_, x) => (
                <div
                  key={x}
                  className={`space ${getClassName(x, y)}`}
                  onClick={() => {
                    if (canChangeSpace(x, y)) {
                      if (state.currentSpace !== DO_NOT_CHANGE) {
                        dispatch({
                          type: "gridF",
                          x: x,
                          y: y,
                          value: state.currentSpace,
                        });
                      }
                      if (state.currentBlock !== DO_NOT_CHANGE) {
                        dispatch({
                          type: "gridM",
                          x: x,
                          y: y,
                          value: state.currentBlock,
                        });
                      }
                    }
                  }}
                >
                  <div className={classSuperposition(x, y)}></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
