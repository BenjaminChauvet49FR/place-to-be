from django.db import migrations

def set_null_creator_positions(apps, schema_editor):
    Level = apps.get_model("level_management", "Level")

    Level.objects.filter(
        creator__isnull=True,
        position__isnull=True
    ).update(position=0)

class Migration(migrations.Migration):

    dependencies = [
        ("level_management", "0004_level_fill_positions"),
    ]

    operations = [
        migrations.RunPython(set_null_creator_positions),
    ]