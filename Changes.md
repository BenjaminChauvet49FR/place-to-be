# Ce qui a changé ce commit

Dans les niveaux de la quête principale, j'ai ajouté les boutons "Niveau précédent" et "Niveau suivant" pour permettre une navigation rapide. Ceux-ci sont grisés si le numéro du niveau actuel est égal à 1 ou au nombre de niveaux joués.

# Côté technique

Uniquement du frontend cette fois, malgré un appel à l'API

* Ajout d'un contexte + provider + reducer pour gérer le niveau en cours ainsi que le nombre total de niveaux 
  
  * recharge du niveau automatique dans Playing_FromQuest

* Modification du routeur dans index.js pour le faire englober du nouveau provider : un peu lourd au commit, mais il n'y a rien d'autre

* Ajout d'une fonction de chargement du nombre total de niveaux existants (appelle à l'API la même adresse que celle qui chargeait tous les niveaux dans quête principale) 
  
  * Cette dernière fonction est appelée à l'authentification, dans la méthode login de AuthContext 
  
  * Cependant, comme il fallait pouvoir dispatcher le "nombre total de niveaux" au moment où l'utilisateur se connecte, j'ai dû modifier login en un hook useLogin, qui appelle la fonction login.  
  
  * Mise à jour des appels dans NameForm.jsx et NewUser/index.jsx, qui utilisaient useLogin() tous les deux

* Modification de PlayPanel pour l'ajout des boutons (intérêt de récuperer le nombre total de niveaux = griser le bouton "niveau suivant" quand on est au dernier)
  
  * plus tard, le bouton "niveau suivant" sera grisé là-dessus, mais aussi si on a pas accès au niveau suivant (ce sera dans un futur commit)

# Ce qui reste à améliorer

* URGENT : Gérer l'effacement correct des niveaux ! A l'heure actuelle, si un auteur supprime le niveau 8 la liste des niveaux n'est pas mise à jour et reste ...6,7,9...  (jusque là c'était pas gênant car les numéros ne jouaient aucun rôle concret côté front) 
- Gérer la réussite et le déblocage des niveaux (ça fera l'objet d'un gros commit)
