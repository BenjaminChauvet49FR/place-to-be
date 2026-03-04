import { SPACE, REAL_XLENGTH, REAL_YLENGTH } from "../../logic/constants";
import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState } from "react";

function dummyEditorGridF() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      field[y].push(SPACE.EMPTY);
    }
  }
  for (let i = 0; i < REAL_YLENGTH; i++) {
    field[i][0] = SPACE.WALL;
    field[i][REAL_XLENGTH - 1] = SPACE.WALL;
  }
  for (let i = 0; i < REAL_XLENGTH; i++) {
    field[0][i] = SPACE.WALL;
    field[REAL_YLENGTH - 1][i] = SPACE.WALL;
  }
  return field;
}

function dummyEditorGridM() {
  let field = [];
  for (let y = 0; y < REAL_YLENGTH; y++) {
    field.push([]);
    for (let x = 0; x < REAL_XLENGTH; x++) {
      // TODO change these hard-coded values !
      field[y].push(-1); // TODO change -1s everywhere !
    }
  }
  return field;
}

export default function EditPage() {
  const [editorState, updateEditorState] = useState({
    currentSpace: SPACE.EMPTY,
    currentBlock: -1,
  });
  const [gridF, updateGridF] = useState(dummyEditorGridF());
  const [gridM, updateGridM] = useState(dummyEditorGridM());

  return (
    <div>
      <EditorField
        gridF={gridF}
        updateGridF={updateGridF}
        gridM={gridM}
        updateGridM={updateGridM}
        editorState={editorState}
      ></EditorField>
      <EditorPanel
        editorState={editorState}
        updateEditorState={updateEditorState}
      ></EditorPanel>
    </div>
  );
}
