import {rawLevels} from '../assets/LevelBook.jsx';

export const SPACE = {
	EMPTY : '0',
	WALL : '1'
}

export const BLOCK = {
	A : 'A',
	B : 'B',	
	C : 'C'	
}

export const DIRECTION = {
	L : 0,
	U : 1,
	R : 2,
	D : 3
}

export function OPPOSITE_DIRECTION(pDir) {return (pDir+2) % 4;}

export const MOVES = [{dx : -1, dy : 0}, {dx : 0, dy : -1}, {dx : 1, dy : 0}, {dx : 0, dy : 1}];

// ===================

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

export function moveBlocks(pDirection, pLuggage) {
	let levelState = pLuggage.levelState;
	let gridM = pLuggage.gridM;
	let gridF = pLuggage.gridF;
	
	let itemsInGrid = levelState.itemsInGrid;
	let moves = levelState.moves;
	
	let x, y, dx, dy, x2, y2;
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
	pLuggage.updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
	pLuggage.updateGridM(gridM);
}
	
export function undo(pLuggage) {
	let levelState = pLuggage.levelState;
	let gridM = pLuggage.gridM;	
	
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
			gridM[y][x] = newPos.previousID;
		});
		pLuggage.updateLevelState({moves : levelState.moves, itemsInGrid : itemsInGrid});
		pLuggage.updateGridM(gridM);
	}
	
}
