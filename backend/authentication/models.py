from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    lastLevelSolved = models.IntegerField(default=0)
