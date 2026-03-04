import { SPACE, BLOCK } from "../assets/Logic.jsx";
import "../styles/style.css";

function EditorPanel({ editorState, updateEditorState }) {
  function selectSpace(pFixed) {
    updateEditorState((prev) => ({
      ...prev,
      currentSpace: pFixed,
      currentBlock: -1,
    }));
  }

  function selectBlock(pMobile) {
    updateEditorState((prev) => ({
      ...prev,
      currentSpace: SPACE.EMPTY,
      currentBlock: pMobile,
    }));
  }

  return (
    <div>
      Actuellement sélectionné : {editorState.currentSpace}{" "}
      {editorState.currentBlock}
      {"     "}
      <button onClick={() => selectSpace(SPACE.WALL)}>Mur</button>
      <button onClick={() => selectSpace(SPACE.EMPTY)}>Case vide</button>
      <button className="buttonSelectionA" onClick={() => selectBlock(BLOCK.A)}>
        Bloc A
      </button>
      <button className="buttonSelectionB" onClick={() => selectBlock(BLOCK.B)}>
        Bloc B
      </button>
      <button className="buttonSelectionC" onClick={() => selectBlock(BLOCK.C)}>
        Bloc C
      </button>
    </div>
  );
}

export default EditorPanel;
