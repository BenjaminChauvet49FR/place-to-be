# Ce qui a changé ce commit

Theme principal : ajout côté front de la possibilité de jouer directement un niveau

* Séparation de la page de jeu `Playing` en 2 pages selon qu'on soit dans un contexte de jeu en édition (`Playing_FromEdit`) ou de simple jeu (`Playing_FromFree`) 
* Transformation de `Playing` en 2 composants
* Différences de page gérées par `ìndex.js` à la racine 
* Appel aux differents viewpoints 

# Ce qui reste à ameliorer

* Faire en sorte que l'édition ne soit accessible qu'aux connectés
