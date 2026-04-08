# Ce qui a changé ce commit

Theme principal : empêché l'accès en édition à un niveau pour un autre utilisateur (via manipulation de l'URL dans le navigateur par exemple)

Pour cela :

- Ajout d'une classe privilège côté back end
- Ajout côté front d'une exception (Error404) levée par l'API saveLoad.jsx + d'un mécanisme de redirection sur la page d'édition de niveau
- Ajout d'une page + route correspondant aux niveaux inaccessibles
