# Ce qui a changé ce commit

J'ai mis en place la "bascule d'encodage", et je l'ai appliquée au changement d'encodage du commit précédent (prise en compte des limites de coups par niveaux)

Il y a deux système de décodage des fichiers : un "ancien" et un "nouveau". 

* Par défaut, ils doivent être identiques : un seul des deux a un "vrai" corps, l'autre renvoie vers le premier, sans importance. Cependant, lorsqu'on veut changer l'encodage, il faut dupliquer le "vrai corps" du premier dans l'autre.

* Dans un contexte de changement d'encodage, tant que la bascule n'a pas eu lieu, les niveaux sont TOUS sauvegardés dans le nouveau système. Ils doivent obligatoirement être renommés avec un préfixe défini dans le fichier `encodingBascule.jsx` (cf. ci-dessous)

# Côté technique

Déplacement de fonctions de saveLoad.jsx

- J'ai créé un fichier `encodeDecode.jsx` qui gère les encodages et les décodages. Celle-ci contient les fonctions qui existent déjà :
  - Il y a une fonction d'encodage unique
  - Il y a deux fonctions de décodage : une pour l'ancien système...
  - ...et une pour le nouveau système
- J'ai également créé un fichier `encodingBascule.jsx`, mais celui-ci ne comprend que la fonction d'appel à tous les fichiers pour charger et sauvegarder. 
- Dans `saveLoad.jsx` il y a deux constantes : 
  - une nommée `PREFIX_FOR_BASCULE_ENCODING`qui définit la string par laquelle tous les niveaux qui ont été sauvegardés dans le nouveau système d'encodage doivent voir leur nom commencer ; les autres sont toujours sauvegardés dans l'ancien système et doivent être chargés dans l'ancien système de décodage... jusqu'à ce que la bascule ait eu lieu
  - et une nommée `BASCULE_ENCODING_DONE`, pour quand on veut que le nouveau système de décodage soit utilisé pour tous les niveaux, pas seulement pour ceux au nom en `PREFIX_FOR_BASCULE_ENCODING`; à utiliser lorsqu'on ne veut pas encore se débarasser de l'ancien système de décodage.

Modification de l'appel à l'API : j'ai fait en sorte que seuls les IDs soient retournés. Modification du front, et de l'appel côté back.

* De plus, j'ai utilisé `loadLevelFromID_FREE`et non `loadLevelFromID_CONNECTED`, ce dernier étant réservé aux niveaux d'un user précis.

# Ce qui reste à améliorer

* Faire en sorte que le bouton de bascule d'encodage ne soit visible que de certains utilisateurs privilégiés (et le déplacer dans le menu d'édition plutôt que dans le menu d'un niveau en particulier, après tout ça porte sur tous les niveaux)
  
  * sans oublier de faire les vérifications en back, bien sûr. (je comptais faire tout ça sur ce commit mais ça aurait fait beaucoup)

* Il n'y a toujours pas d'impact dans le gameplay : on peut dépasser tant qu'on veut le nombre de coups limite lorsqu'on joue.

* Si le nombre de coups dépasse 10, la fraction peut être trop large ; il va falloir élargir les boutons dans le CSS.
