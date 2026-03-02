import {SPACE, BLOCK, DIRECTION, OPPOSITE_DIRECTION, MOVES} from '../assets/Logic.jsx';
import {rawLevels} from '../assets/LevelBook.jsx';

function isBlock(pChar) {
	return pChar == BLOCK.A || pChar == BLOCK.B || pChar == BLOCK.C;
}

export function startLevel(pCurrentLevelID, pUpdaters) {
	const gridF = [];
	const gridM = [];
	const itemsInGrid = [];
	let id, blockType;
	const rawLevel = rawLevels[pCurrentLevelID];
	for (let y = 1 ; y < rawLevel.length ; y++) {
		gridF.push([]);
		gridM.push([]);
		for (let x = 0 ; x < rawLevel[y].length ; x++) {
			gridF[y-1].push(rawLevel[y].charAt(x));
			gridM[y-1].push(-1); 
			
			if (isBlock(gridF[y-1][x])) {
				blockType = gridF[y-1][x];
				gridF[y-1][x] = SPACE.EMPTY;
				id = itemsInGrid.length;
				itemsInGrid.push({blockType : blockType, x : x, y : y-1, id : itemsInGrid.length});
				gridM[y-1][x] = id;
			}
		}
	}
	pUpdaters.updateLevelState({moves : [], itemsInGrid : itemsInGrid});
	pUpdaters.updateGridF(gridF);
	pUpdaters.updateGridM(gridM);
	pUpdaters.updateCurrentLevelID(pCurrentLevelID);
}


function CommandsPanel({currentLevelID, updateCurrentLevelID, gridF, updateGridF, gridM, updateGridM, levelState, updateLevelState}) {

	let pUpdaters = {
		updateCurrentLevelID : updateCurrentLevelID, 
		updateGridF : updateGridF,
		updateGridM : updateGridM, 
		updateLevelState : updateLevelState 
	}
	
	function restartLevel() {
		startLevel(currentLevelID, pUpdaters);
	}

	function prevLevel() {
		if (currentLevelID > 0) { //updateCurrentLevelID, updateGrid, updateLevelState
			startLevel(currentLevelID-1, pUpdaters);
		}
	}
	function nextLevel() {
		if (currentLevelID < rawLevels.length-1) {
			startLevel(currentLevelID+1, pUpdaters);
		}
	}

	function moveBlocks(pDirection) {
		let x, y, dx, dy, x2, y2;
		let itemsInGrid = levelState.itemsInGrid;
		let moves = levelState.moves;
		let prevID;
		
		// WARNING ! We are sorting blocks according to their coordinates. This works only if we are sure that blocks are moved only by our moves, and not by teleporters, conveyor belts, etc...
		itemsInGrid.sort(function(pItem1, pItem2) {return pItem1.x - pItem2.x}); 
		
		
		moves.push({direction : pDirection, newPosBlocks : []});
			
		itemsInGrid.forEach(itemInGrid => {
			x = itemInGrid.x;
			y = itemInGrid.y;
			x2 = x+MOVES[pDirection].dx;
			y2 = y+MOVES[pDirection].dy;
			prevID = gridM[y2][x2];
			if (gridF[y2][x2] != SPACE.WALL && gridM[y2][x2] == -1) {
				gridM[y2][x2] = itemInGrid.id;
				gridM[y][x] = -1;
				itemInGrid.x = x2;
				itemInGrid.y = y2;
				moves[moves.length-1].newPosBlocks.push({x : x2, y : y2, id : itemInGrid.id, previousID : prevID});
			}
		});
		if (moves[moves.length-1].newPosBlocks.length == 0) {
			moves.pop();
		}
		updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
		updateGridM(gridM);
	}
	
	function undo() {
		if (levelState.moves.length > 0) {
			let itemsInGrid = levelState.itemsInGrid;
			let moves = levelState.moves;
			itemsInGrid.sort(function(pItem1, pItem2) {return pItem1.id - pItem2.id}); 
			let moveToUndo = moves.pop();
			let od = OPPOSITE_DIRECTION(moveToUndo.direction);
			let x, y, x2, y2, id;
			moveToUndo.newPosBlocks.forEach(newPos => {
				id = newPos.id;
				x = newPos.x;
				y = newPos.y;
				x2 = x + MOVES[od].dx;
				y2 = y + MOVES[od].dy;	
				gridM[y2][x2] = id;
				gridM[y][x] = newPos.previouslyHereItem;
			});
			updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
			updateGridM(gridM);
		}
		
	}
	
	return (
		<div className="CommandsPanel">
			<button onClick={() => moveBlocks(DIRECTION.L)}>Gauche</button>
			<button onClick={() => moveBlocks(DIRECTION.U)}>Haut</button>
			<button onClick={() => moveBlocks(DIRECTION.R)}>Droite</button>
			<button onClick={() => moveBlocks(DIRECTION.D)}>Bas</button>
			<button onClick={() => undo()}>Annuler</button>
			<button onClick={() => prevLevel()}>Niv. précédent</button>
			<button onClick={() => restartLevel()}>Redémarrer</button>
			<button onClick={() => nextLevel()}>Niv. suivant</button>	
		</div>
	);
}

export default CommandsPanel;
