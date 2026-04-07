# Ce qui a changé ce commit

Theme principal : fermeture côté front de l'accès à l'édition aux connectés (redirection vers "doNotEditLevel")

Création de pages :

- Accueil
- Redirection pour erreurs connexions

Thème principal :

- Test de connexion côté front ̀`AuthContext.jsx` et test plus complet côté back `api/me`
- Pas mal de modifications dans le routeur
- Ajout de PrivateEditRoute, un wrappeur qui permet de naviguer vers la page NoEditLevel (cf. ci-dessous)

Aussi : Modification de NameForm selon qu'on est connecté ou non

# Ce qui reste à ameliorer

- Faire en sorte que l'édition ne soit accessible qu'à l'auteur du niveau
