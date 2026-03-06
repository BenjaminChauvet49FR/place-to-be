import { SPACE, BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";

function EditorField({ state, dispatch, loadingPackage }) {
  const xLength = state.gridF[0].length;
  const yLength = state.gridF.length;

  function getClassName(pX, pY) {
    switch (state.gridF[pY][pX]) {
      case SPACE.EMPTY:
        if (state.gridM[pY][pX] === BLOCK.NONE) {
          return "space_empty";
        } else {
          switch (state.gridM[pY][pX]) {
            case BLOCK.A:
              return "blockA";
            case BLOCK.B:
              return "blockB";
            case BLOCK.C:
              return "blockC";
            default:
              return 1 / 0;
          }
        }
      case SPACE.WALL:
        return "space_wall";
      default:
        return "space_empty";
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
                    dispatch({
                      type: "gridF",
                      x: x,
                      y: y,
                      value: state.currentSpace,
                    });
                    dispatch({
                      type: "gridM",
                      x: x,
                      y: y,
                      value: state.currentBlock,
                    });
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditorField;
