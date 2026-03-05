import { SPACE, BLOCK, NO_ID_BLOCK } from "../logic/constants.jsx";
import "../styles/style.css";

function PlayField({ gridF, gridM, levelState }) {
  const xLength = gridF[0].length;
  const yLength = gridF.length;

  function getClassName(pX, pY) {
    switch (gridF[pY][pX]) {
      case SPACE.EMPTY:
        if (gridM[pY][pX] === NO_ID_BLOCK) {
          return "space_empty";
        } else {
          switch (levelState.itemsInGrid[gridM[pY][pX]].blockType) {
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
    <div className="playField">
      {Array.from({ length: yLength }).map((_, y) => (
        <div key={y} className="spaceRow">
          {Array.from({ length: xLength }).map((_, x) => (
            <div key={x} className={`space ${getClassName(x, y)}`}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default PlayField;
