import logo from './logo.svg';
import './App.css';
import PlayField from './components/PlayField.jsx';
import CommandsPanel  from './components/CommandsPanel.jsx';
import {startLevel} from './components/CommandsPanel.jsx';
import {SPACE} from './assets/Logic.jsx';

import { useState, useEffect } from 'react'

function App() {

	const [grid, updateGrid] = useState([[]]);
	const [levelState, updateLevelState] = useState({moves : [], itemsInGrid : []});
	const [currentLevelID, updateCurrentLevelID] = useState(0);
	
	useEffect(() => {
	  startLevel(
		currentLevelID,
		{
			updateCurrentLevelID : updateCurrentLevelID, 
			updateGrid : updateGrid, 
			updateLevelState : updateLevelState 
		}
	  );
	}, [currentLevelID]);
	
	return (
		<div className="App">
			<PlayField grid={grid} levelState={levelState}></PlayField>
			<CommandsPanel currentLevelID={currentLevelID} updateCurrentLevelID={updateCurrentLevelID} 
					grid={grid} updateGrid={updateGrid} 
					levelState={levelState} updateLevelState={updateLevelState}>
			</CommandsPanel>
		</div>
	);
}

export default App;



