# Ce qui a changé ce commit

* Ajout de cibles : coté edition et coté jeu, 
* Parti pris de créer des icônes de validation pour quand un bloc est sur sa cible (cf. les superpositions)
* Ajout d'images (blocs transformés en images, + cibles + icones de validation)
* Premier changement d'encodage de niveau : prise en compte des cibles + prise en compte que le niveau n'occupe pas les 400 cases 
* refonte de SaveLoad : 
  * ajout d'un systeme de transfert d'encodage (oldVersion, newVersion, possibilité de transférer tous les niveaux)

# Ce qui reste à ameliorer

* Encodage dans le cas où les murs sur les bords sont complètement vides
* Colorier les boutons de blocs (éditeur) 
* Colorier la couleur active côté bloc et côté éditeur
* Cas d'erreur de récupération des données de l'API VS cas d'erreur dans le traitement de ces données : distinguer les window.alert
