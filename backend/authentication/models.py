from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    lastLevelSolved = models.IntegerField(default=0)

    class Meta:
        permissions = [('cheat_level', 'Peut déclarer un niveau réussi même sans l\'avoir fait'),
                       ('change_encoding_all_levels', 'Peut changer l\'encodage des niveaux enregistrés')]
