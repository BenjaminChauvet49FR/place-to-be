# Merci ChatGPT ;)

from django.db import migrations, models

def fill_positions(apps, schema_editor):
    Level = apps.get_model("level_management", "Level")
    User = apps.get_model("authentication", "User")

    for user in User.objects.all():
        levels = Level.objects.filter(creator=user).order_by("id")

        for i, level in enumerate(levels, start=1):
            level.position = i
            level.save(update_fields=["position"])

class Migration(migrations.Migration):

    dependencies = [('level_management', '0003_level_position')]

    operations = [
        migrations.RunPython(fill_positions),
    ]