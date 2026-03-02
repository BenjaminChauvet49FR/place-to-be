import {SPACE, DIRECTION, OPPOSITE_DIRECTION, MOVES} from '../assets/Logic.jsx';
import {rawLevels} from '../assets/LevelBook.jsx';

export function startLevel(pCurrentLevelID, pUpdaters) {
	const grid = [];
	const itemsInGrid = [];
	const rawLevel = rawLevels[pCurrentLevelID];
	for (let y = 1 ; y < rawLevel.length ; y++) {
		grid.push([]);
		for (let x = 0 ; x < rawLevel[y].length ; x++) {
			grid[y-1].push(rawLevel[y].charAt(x));
			 
			if (grid[y-1][x] == SPACE.BLOCK) {
				itemsInGrid.push({item : SPACE.BLOCK, x : x, y : y-1, id : itemsInGrid.length});
			}
		}
	}
	pUpdaters.updateLevelState({moves : [], itemsInGrid : itemsInGrid});
	pUpdaters.updateGrid(grid);
	pUpdaters.updateCurrentLevelID(pCurrentLevelID);
}


function CommandsPanel({currentLevelID, updateCurrentLevelID, grid, updateGrid, levelState, updateLevelState}) {

	let pUpdaters = {
		updateCurrentLevelID : updateCurrentLevelID, 
		updateGrid : updateGrid, 
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
		let prevItem;
		
		// WARNING ! We are sorting blocks according to their coordinates. This works only if we are sure that blocks are moved only by our moves, and not by teleporters, conveyor belts, etc...
		itemsInGrid.sort(function(pItem1, pItem2) {return pItem1.x - pItem2.x}); 
		
		
		moves.push({direction : pDirection, newPosBlocks : []});
			
		itemsInGrid.forEach(itemInGrid => {
			x = itemInGrid.x;
			y = itemInGrid.y;
			x2 = x+MOVES[pDirection].dx;
			y2 = y+MOVES[pDirection].dy;
			prevItem = grid[y2][x2];
			if (grid[y2][x2] != SPACE.WALL && grid[y2][x2] != SPACE.BLOCK) {
				grid[y2][x2] = SPACE.BLOCK;
				grid[y][x] = SPACE.EMPTY;
				itemInGrid.x = x2;
				itemInGrid.y = y2;
				moves[moves.length-1].newPosBlocks.push({x : x2, y : y2, id : itemInGrid.id, previouslyHereItem : prevItem});
			}
		});
		if (moves[moves.length-1].newPosBlocks.length == 0) {
			moves.pop();
		}
		updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
		updateGrid(grid);
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
				grid[y2][x2] = SPACE.BLOCK;
				grid[y][x] = newPos.previouslyHereItem;
			});
			updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
			updateGrid(grid);
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
