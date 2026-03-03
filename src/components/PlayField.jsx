import {SPACE, BLOCK} from '../assets/Logic.jsx';
import '../styles/style.css';

function PlayField({gridF, gridM, levelState}) {
	const xLength = gridF[0].length;
	const yLength = gridF.length;	
	
	function getClassName(pX, pY) {
		switch(gridF[pY][pX]) {
			case SPACE.EMPTY : 
				if (gridM[pY][pX] == -1) {
					return 'space_empty';
				} else {
					switch(levelState.itemsInGrid[gridM[pY][pX]].blockType) {
						case BLOCK.A : return 'blockA'; break;
						case BLOCK.B : return 'blockB'; break;
						case BLOCK.C : return 'blockC'; break;
					}
					return 1/0;
				}
			break;
			case SPACE.WALL : return 'space_wall'; break;
			default : return 'space_empty'; break;
		}
	}
	
	return <div className='playField'>
	  {Array.from({ length: yLength }).map((_, y) => (
            <div key={y} className='spaceRow'>
            	{Array.from({ length: xLength }).map((_, x) => (
            		<div key={x} className={`space ${getClassName(x, y)}`}></div>
            	))}
            </div>
          ))}
	</div> 
	



}

export default PlayField;
