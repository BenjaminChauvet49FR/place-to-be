# Ce qui a changé ce commit

J'ai assuré l'encodage des limites de mouvement dans les niveaux

# Côté technique

Modification intense de saveLoad.jsx

- Duplication de loadLevelForEditorPreviousSystem dans loadLevelForEditorNewSystem pour pouvoir faire des tests sur le décodage des nouveaux niveaux.
- tous les niveaux enregistrés sous le nouveau système ont vu le préfixe en "TEST_ENCODING_PURPOSE_ONLY" ajouté à leur nom, afin de pouvoir tester en sécurité.
- Une fois ce commit bouclé, je compte faire un changement d'encodage dans tous les niveaux via le "bouton dangereux" : je vais appeler ça la "bascule d'encodage".
- Modification du dispatch (et clarification de l'exception de mauvaise utilisation)
- les objets décodés n'étaient que les grilles fixes et mobiles, renvoyés dans un objet nommé `pReturnedGrids` (pourquoi p d'ailleurs ? c'était même pas un paramètre) J'ai changé le nom en `loadedData` , plus explicite.

# Ce qui reste à améliorer

* Côté technique : 
  
  * mise à part des fonctions d'encodage
  
  * avant de faire le basculement d'encodage, corriger un bug que j'ai repéré sur le fait de charger tous les niveaux.

* Il n'y a toujours pas d'impact dans le gameplay : on peut dépasser tant qu'on veut le nombre de coups limite lorsqu'on joue.

* Si le nombre de coups dépasse 10, la fraction peut être trop large ; il va falloir élargir les boutons dans le CSS.
