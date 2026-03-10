# Ce qui a changé ce commit

* En plus de LevelEditContext, LevelEditReducer : ajout LevelPlayContext, LevelPlayReducer
* Pour la mise en place des contextes :
  * Grand menage dans gameplay.jsx et le composant CommandsPanel 
  * Epuration page Playing et composant PlayField
* Ajout d'un bouton de retour du jeu vers l'editeur (gere par un booleen dans le LevelEditReducer, pour signifier qu'il faut garder la grille)

# Ce qui reste à ameliorer

* Dans CommandsPanel.jsx (l'appel a commandes), beaucoup d'appels a state et a useHook. Il faudra en retirer...
* La navigation dans le bouton de retour de CommandsPanel.jsx (new, et levelID : nécessite synchronisation avec EditorMenu.)
