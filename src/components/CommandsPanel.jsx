import {SPACE, DIRECTION, OPPOSITE_DIRECTION, MOVES} from '../assets/Logic.jsx';

function CommandsPanel({grid, updateGrid, levelState, updateLevelState}) {

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
		</div>
	);
}

export default CommandsPanel;
