# Ce qui a changé ce commit

J'ai déplacé les niveaux de la quête principale dans un menu à part

Les niveaux sont accessibles par leur numéro (position) et non par leur ID

J'ai fait en sorte qu'il ne soit accessible, ainsi que les niveaux, qu'aux utilisateurs connectés ; sinon, redirection appropriée.

# Côté technique

* Frontend : J'ai créé des constantes sur les adresses joignables par l'API

* J'ai créé une nouvelle page de jeux de niveaux (après PlayFromEdit et PlayFromFree)

* J'ai renommé PrivateEditRoute.jsx en PrivateRoute.jsx ; créé des pages "NoMainQuest" et une page "NoLevelQuest" pour cela. 

* Ajout d'une fonction de chargement d'un niveau de la quête principale à partir de la position (grande modification de saveLoad.jsx pour cela)

* Backend : J'ai créé des endpoints sur les niveaux "main quest" en faisant en sorte que seuls certains niveaux précis (ceux de la main quest) soient retournés

* J'ai fait en sorte qu'on puisse retourner un niveau à partir du numéro de position

# Ce qui reste à améliorer

* Continuer la mise en constante des adresses de l'API

* Continuer à modiefier PrivateRoute.jsx

* Changer le modèle User pour tester les niveaux réussis et les derniers niveaux accessibles
  
  * changer le front en conséquence, bien sûr
  
  * et créer une page de "niveau inaccessible"
  
  * Mais avant tout, s'assurer qu'un niveau est "réussi"

* La page de jeu de niveau, pour pouvoir faire précédent/suivant

* Pour les pages de PrivateRoute, ajouter un lien vers la création de compte utilisateur.

* Revoir le message d'erreur pour quand on n'arrive pas à charger un niveau.

* Certaines améliorations apportées côté panel quand on vient de la "quête principale" doivent être apportées aussi côté panel du mode "jeu libre" : 
  
  * création d'un bouton de retour au menu
  
  * tentative d'accès à un niveau inaccessible (créer une page similaire à NoLevelQuest pour cela)
