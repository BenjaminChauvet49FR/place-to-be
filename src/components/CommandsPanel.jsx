import {SPACE, BLOCK, DIRECTION, OPPOSITE_DIRECTION, MOVES, nextLevel, previousLevel, restartLevel, moveBlocks, undo, getBlockTypes, setCurrentBlockType, getCurrentBlockType} from '../assets/Logic.jsx';
import {rawLevels} from '../assets/LevelBook.jsx';




function CommandsPanel({gridF, updateGridF, levelInfos, updateLevelInfos, gridM, updateGridM, levelState, updateLevelState}) {

	let pStartLuggage = {

		updateGridF : updateGridF,
		updateGridM : updateGridM, 
		updateLevelState : updateLevelState,
		updateLevelInfos : updateLevelInfos,
		levelInfos : levelInfos
	}
	
	let pLuggage = {
		levelState : levelState,
		updateLevelState : updateLevelState, 
		gridM : gridM,
		updateGridM : updateGridM,
	
		levelInfos : levelInfos,
		gridF : gridF
	}

	return (
		<div className="CommandsPanel">
			<button onClick={() => moveBlocks(DIRECTION.L, pLuggage)}>Gauche</button>
			<button onClick={() => moveBlocks(DIRECTION.U, pLuggage)}>Haut</button>
			<button onClick={() => moveBlocks(DIRECTION.R, pLuggage)}>Droite</button>
			<button onClick={() => moveBlocks(DIRECTION.D, pLuggage)}>Bas</button>
			<button onClick={() => undo(pLuggage)}>Annuler</button><br/>
			Couleur active = {getCurrentBlockType(levelInfos, levelState)}
			{getBlockTypes(levelInfos).map(blockType => 
				<button key={blockType} onClick={() => setCurrentBlockType(blockType, levelInfos, updateLevelState)}>Sélectionner {blockType}</button>
			)}<br/>
			<button onClick={() => previousLevel(pStartLuggage)}>Niv. précédent</button>
			<button onClick={() => restartLevel(pStartLuggage)}>Redémarrer</button>
			<button onClick={() => nextLevel(pStartLuggage)}>Niv. suivant</button>
			
		</div>
	);
}

export default CommandsPanel;
