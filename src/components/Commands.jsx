function CommandsPanel({grid, levelState, updateLevelState}) {

	function moveBlocks(pDX, pDY) {
		
	}
	
	function undo() {
	
	}
	
	return (
		<div className="CommandsPanel">
			<button onClick={() => moveBlocks(-1,0)}>Gauche</button>
			<button onClick={() => moveBlocks(0,-1)}>Haut</button>
			<button onClick={() => moveBlocks(1,0)}>Droite</button>
			<button onClick={() => moveBlocks(0,1)}>Bas</button>
			<button onClick={() => undo()}>Annuler</button>
		</div>
	);
}

export default CommandsPanel;
