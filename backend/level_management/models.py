from django.db import models
from django.conf import settings

class Level(models.Model):

    lvData = models.fields.CharField(max_length=400)
    name = models.fields.CharField(max_length=100, default='')
    position = models.PositiveIntegerField(default=0)

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,

        related_name="levels"
    )

    def __str__(self):
        return self.name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["creator", "position"],
                name="unique_position_per_creator"
            )
        ]

        ordering = ["position", "id"]
