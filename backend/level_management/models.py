from django.db import models
from django.conf import settings

class Level(models.Model):

    data = models.fields.CharField(max_length=400)
    name = models.fields.CharField(max_length=100, default='')
    position = models.PositiveIntegerField(null=True, blank=True)

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,

        related_name="levels"
    )

    def __str__(self):
        return self.name