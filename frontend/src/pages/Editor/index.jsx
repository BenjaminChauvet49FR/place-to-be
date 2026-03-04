import { SPACE, BLOCK } from "../../assets/Logic";
import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState, useEffect } from "react";

function dummyEditorGridF() {
  let field = [];
  for (let y = 0; y < 22; y++) {
    field.push([]);
    for (let x = 0; x < 22; x++) {
      // TODO change these hard-coded values !
      field[y].push(SPACE.EMPTY);
    }
  }
  for (let i = 0; i < 22; i++) {
    field[i][0] = SPACE.WALL;
    field[i][22 - 1] = SPACE.WALL;
    field[0][i] = SPACE.WALL;
    field[22 - 1][i] = SPACE.WALL;
  }
  return field;
}

function dummyEditorGridM() {
  let field = [];
  for (let y = 0; y < 22; y++) {
    field.push([]);
    for (let x = 0; x < 22; x++) {
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
