import {SPACE} from '../assets/Logic.jsx';
import '../styles/style.css';

function PlayField({grid}) {
	const xLength = grid[0].length;
	const yLength = grid.length;	
	
	function getClassName(pX, pY) {
		switch(grid[pY][pX]) {
			case SPACE.EMPTY : return 'space_empty'; break;
			case SPACE.WALL : return 'space_wall'; break;			
			case SPACE.BLOCK : return 'space_block'; break;
			default : return 'space_empty'; break;
		}
	}
	
	return (Array.from({ length: yLength }).map((_, y) => (
            <div key={y} className='spaceRow'>
            	{Array.from({ length: xLength }).map((_, x) => (
            		<div key={x} className={`space ${getClassName(x, y)}`}></div>
            	))}
            </div>
          )))


}

export default PlayField;
