import PlayField from "./PlayField.jsx";
import PlayPanel from "./PlayPanel.jsx";
import { useStartLevelFromGrid } from "../logic/gameplay.jsx";

export default function Component() {
  useStartLevelFromGrid();

  return (
    <div>
      <PlayField></PlayField>
      <PlayPanel></PlayPanel>
    </div>
  );
}
