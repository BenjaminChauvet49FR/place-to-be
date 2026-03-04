from django.db import models

class Level(models.Model):

    data = models.fields.CharField(max_length=400)
    name = models.fields.CharField(max_length=100, default='')