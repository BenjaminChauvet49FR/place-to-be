import { SPACE, BLOCK, DO_NOT_CHANGE } from "../logic/constants.jsx";
import "../styles/style.css";
import { useContext } from "react";
import { LevelEditContext } from "../context/LevelEditContext.jsx";

function EditorField({ loadingPackage }) {
  const { state, dispatch } = useContext(LevelEditContext);
  const xLength = state.gridF[0].length;
  const yLength = state.gridF.length;

  function getClassName(pX, pY) {
    if (state.gridF[pY][pX] === SPACE.WALL) {
      return "space_wall";
    } else {
      if (state.gridM[pY][pX] !== BLOCK.NONE) {
        switch (state.gridM[pY][pX]) {
          case BLOCK.A:
            return "space_blockA";
          case BLOCK.B:
            return "space_blockB";
          case BLOCK.C:
            return "space_blockC";
          default:
            window.alert(
              "Attention, erreur de className, cf. EditorPanel ! (EditorField) " +
                state.gridF[pY][pX] +
                "," +
                state.gridM[pY][pX],
            );
            return 1 / 0;
        }
      }
      if (state.gridF[pY][pX] === SPACE.GOAL_A) {
        return "space_goalA";
      }
      if (state.gridF[pY][pX] === SPACE.GOAL_B) {
        return "space_goalB";
      }
      if (state.gridF[pY][pX] === SPACE.GOAL_C) {
        return "space_goalC";
      }
      if (state.gridF[pY][pX] === SPACE.EMPTY) {
        return "space_empty";
      }
      window.alert(
        "Attention, erreur de className, cf. EditorPanel ! (EditorField) " +
          state.gridF[pY][pX] +
          "," +
          state.gridM[pY][pX],
      );
      return 1 / 0;
    }
  }

  function classSuperposition(pX, pY) {
    if (
      state.gridF[pY][pX] === SPACE.EMPTY ||
      state.gridM[pY][pX] === BLOCK.NONE
    ) {
      return "superposition none";
    }
    if (state.gridF[pY][pX] === state.gridM[pY][pX]) {
      return "superposition correct";
    } else {
      return "superposition wrong_" + state.gridF[pY][pX];
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

export default EditorField;
