import {
  BLOCK,
  BLOCK_DISPLAY_INFO,
  DO_NOT_CHANGE,
  SPACE_DISPLAY_INFO,
  SUPERPOSITION_CORRECT,
  SUPERPOSITION_NONE,
  SUPERPOSITION_WRONG,
  canChangeSpace,
  blockFamilyFromStr,
  spaceFamilyFromStr,
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
      return BLOCK_DISPLAY_INFO[state.gridM[pY][pX]].className;
    } else {
      return SPACE_DISPLAY_INFO[state.gridF[pY][pX]].className;
    }
  }

  function classSuperposition(pX, pY) {
    if (
      spaceFamilyFromStr(state.gridF[pY][pX]) === -1 ||
      blockFamilyFromStr(state.gridM[pY][pX]) === -1
    ) {
      return SUPERPOSITION_NONE;
    }
    if (
      spaceFamilyFromStr(state.gridF[pY][pX]) ===
      blockFamilyFromStr(state.gridM[pY][pX])
    ) {
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
                <div key={x} className="spaceBG">
                  <div
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
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
