import {
  SPACE,
  BLOCK,
  REAL_XLENGTH,
  REAL_YLENGTH,
} from "../logic/constants.jsx";
import "../styles/style.css";

function EditorField({
  gridF,
  updateGridF,
  gridM,
  updateGridM,
  editorState,
  loadingPackage,
}) {
  const xLength = gridF[0].length;
  const yLength = gridF.length;

  function editCase(pX, pY) {
    if (
      pX !== 0 &&
      pX !== REAL_XLENGTH - 1 &&
      pY !== 0 &&
      pY !== REAL_YLENGTH - 1
    ) {
      updateGridF((prev) =>
        prev.map((row, y) =>
          y !== pY
            ? row
            : row.map((cell, x) =>
                x === pX ? editorState.currentSpace : cell,
              ),
        ),
      );

      updateGridM((prev) =>
        prev.map((row, y) =>
          y !== pY
            ? row
            : row.map((cell, x) =>
                x === pX ? editorState.currentBlock : cell,
              ),
        ),
      );
    }
  }

  function getClassName(pX, pY) {
    switch (gridF[pY][pX]) {
      case SPACE.EMPTY:
        if (gridM[pY][pX] === BLOCK.NONE) {
          return "space_empty";
        } else {
          switch (gridM[pY][pX]) {
            case BLOCK.A:
              return "blockA";
              break;
            case BLOCK.B:
              return "blockB";
              break;
            case BLOCK.C:
              return "blockC";
              break;
            default:
              return 1 / 0;
          }
        }
        break;
      case SPACE.WALL:
        return "space_wall";
        break;
      default:
        return "space_empty";
        break;
    }
  }

  return (
    <div>
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
                  onClick={() => editCase(x, y)}
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
