import logo from './logo.svg';
import './App.css';
import PlayField from './components/PlayField.jsx';
import CommandsPanel from './components/CommandsPanel.jsx';
import {SPACE} from './assets/Logic.jsx';

import { useState } from 'react'

function App() {

	const rawLevel = String.raw`
111111111
100000001
101121101
101111101
102111201
111111111`.split("\n");

	const gridStuff = [];
	const itemsInGrid = [];
	for (let y = 1 ; y < rawLevel.length ; y++) {
		gridStuff.push([]);
		for (let x = 0 ; x < rawLevel[y].length ; x++) {
			gridStuff[y-1].push(rawLevel[y].charAt(x));
			if (gridStuff[y-1][x] == SPACE.BLOCK) {
				itemsInGrid.push({item : SPACE.BLOCK, x : x, y : y-1, id : itemsInGrid.length});
			}
		}
	}
	
	const [grid, updateGrid] = useState(gridStuff);
	const [levelState, updateLevelState] = useState({moves : [], itemsInGrid : itemsInGrid});
	



	return (
		<div className="App">
			<PlayField grid={grid} levelState={levelState}></PlayField>
			<CommandsPanel grid={grid} updateGrid={updateGrid} levelState={levelState} updateLevelState={updateLevelState}></CommandsPanel>
		</div>
	);
}

export default App;



