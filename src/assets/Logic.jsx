export const SPACE = {
	BLOCK : '2',
	EMPTY : '0',
	WALL : '1'
}

export const DIRECTION = {
	L : 0,
	U : 1,
	R : 2,
	D : 3
}

export function OPPOSITE_DIRECTION(pDir) {return (pDir+2) % 4;}

export const MOVES = [{dx : -1, dy : 0}, {dx : 0, dy : -1}, {dx : 1, dy : 0}, {dx : 0, dy : 1}];
