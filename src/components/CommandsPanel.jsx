import {SPACE, BLOCK, DIRECTION, OPPOSITE_DIRECTION, MOVES, startLevel, moveBlocks, undo} from '../assets/Logic.jsx';
import {rawLevels} from '../assets/LevelBook.jsx';




function CommandsPanel({currentLevelID, updateCurrentLevelID, gridF, updateGridF, gridM, updateGridM, levelState, updateLevelState}) {

	let pStartLuggage = {
		updateCurrentLevelID : updateCurrentLevelID, 
		updateGridF : updateGridF,
		updateGridM : updateGridM, 
		updateLevelState : updateLevelState 
	}
	
	function restartLevel() {
		startLevel(currentLevelID, pStartLuggage);
	}

	function prevLevel() {
		if (currentLevelID > 0) { //updateCurrentLevelID, updateGrid, updateLevelState
			startLevel(currentLevelID-1, pStartLuggage);
		}
	}
	function nextLevel() {
		if (currentLevelID < rawLevels.length-1) {
			startLevel(currentLevelID+1, pStartLuggage);
		}
	}
	
	let pLuggage = {
		levelState : levelState,
		updateLevelState : updateLevelState, 
		gridM : gridM,
		updateGridM : updateGridM,
		gridF : gridF
	}

	return (
		<div className="CommandsPanel">
			<button onClick={() => moveBlocks(DIRECTION.L, pLuggage)}>Gauche</button>
			<button onClick={() => moveBlocks(DIRECTION.U, pLuggage)}>Haut</button>
			<button onClick={() => moveBlocks(DIRECTION.R, pLuggage)}>Droite</button>
			<button onClick={() => moveBlocks(DIRECTION.D, pLuggage)}>Bas</button>
			<button onClick={() => undo(pLuggage)}>Annuler</button>
			<button onClick={() => prevLevel()}>Niv. précédent</button>
			<button onClick={() => restartLevel()}>Redémarrer</button>
			<button onClick={() => nextLevel()}>Niv. suivant</button>	
		</div>
	);
}

export default CommandsPanel;
