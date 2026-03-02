import logo from './logo.svg';
import './App.css';
import PlayField from './components/PlayField.jsx';
import CommandsPanel  from './components/CommandsPanel.jsx';
import {startLevel} from './components/CommandsPanel.jsx';
import {SPACE} from './assets/Logic.jsx';

import { useState, useEffect } from 'react'

function App() {

	const [gridF, updateGridF] = useState([[]]);
	const [gridM, updateGridM] = useState([[]]);	
	const [levelState, updateLevelState] = useState({moves : [], itemsInGrid : []});
	const [currentLevelID, updateCurrentLevelID] = useState(0);
	
	useEffect(() => {
	  startLevel(
		currentLevelID,
		{
			updateCurrentLevelID : updateCurrentLevelID, 
			updateGridF : updateGridF, 
			updateGridM : updateGridM, 
			updateLevelState : updateLevelState 
		}
	  );
	}, [currentLevelID]);
	
	return (
		<div className="App">
			<PlayField gridF={gridF} gridM={gridM} levelState={levelState}></PlayField>
			<CommandsPanel currentLevelID={currentLevelID} updateCurrentLevelID={updateCurrentLevelID} 
					gridF={gridF} updateGridF={updateGridF} 
					gridM={gridM} updateGridM={updateGridM}
					levelState={levelState} updateLevelState={updateLevelState}>
			</CommandsPanel>
		</div>
	);
}

export default App;



