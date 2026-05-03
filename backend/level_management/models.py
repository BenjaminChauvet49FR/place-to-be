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

class CompletionStatus(models.TextChoices):
    NORMAL = "normal", "Normal"
    SUPER = "super", "Super"


class LevelCompletion(models.Model):
    status = models.CharField(
        max_length=10,
        choices=CompletionStatus.choices,
        default=CompletionStatus.NORMAL
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="level_completions"
    )

    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="completions"
    )

    class Meta:
        unique_together = ("user", "level")
