# Ce qui a changé ce commit

* Etablissement du lien entre l'edition d'un niveau et la page de jeu
* Suppression de rawData et de levelBank
* Redefinition du rôle de la page Playing (elle sert à tester un niveau de jeu) 
* suppression des boutons de redémarrage de niveau + d'accès aux niveaux 

# Ce qui reste à ameliorer

* Pour l'instant, côté jeu nous utilisons toujours une version du jeu basée sur le chargement des niveaux, ainsi que tous les UseState utilisés à l'époque.
* De plus, la page 'Playing' permet d'aller sur un niveau mais pas d'en ressortir.
* Si la page 'playing' est rechargée, il faudrait rediriger l'utilisateur vers une page d'accueil (non définie pour l'instant.)
