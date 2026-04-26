from django.db import migrations


def seed_permissions(apps, schema_editor):
    User = apps.get_model("authentication", "User")
    Permission = apps.get_model("auth", "Permission")

    try:
        user = User.objects.get(username="___BenjAdmin___")
    except User.DoesNotExist:
        return

    try:
        perm = Permission.objects.get(
            codename="cheat_level",
            content_type__app_label="authentication"
        )
        perm2 = Permission.objects.get(
            codename="change_encoding_all_levels",
            content_type__app_label="authentication"
        )        
    except Permission.DoesNotExist:
        return

    user.user_permissions.add(perm)
    user.user_permissions.add(perm2)


def unseed_permissions(apps, schema_editor):
    User = apps.get_model("authentication", "User")
    Permission = apps.get_model("auth", "Permission")

    try:
        user = User.objects.get(username="___BenjAdmin___")
        perm = Permission.objects.get(
            codename="cheat_level",
            content_type__app_label="authentication"
        )
        perm2 = Permission.objects.get(
            codename="change_encoding_all_levels",
            content_type__app_label="authentication"
        )   
        user.user_permissions.remove(perm)
        user.user_permissions.remove(perm2)
    except:
        pass


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0002_alter_user_options"),
    ]

    operations = [
        migrations.RunPython(
            seed_permissions,
            reverse_code=unseed_permissions
        ),
    ]