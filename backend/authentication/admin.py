from django.contrib import admin

from level_management.models import Level
from .models import User
from level_management.models import Level

#admin.site.register(Level)

@admin.action(description="Attribuer l'auteur admin")
def assign_admin(modeladmin, request, queryset):
    admin_user = User.objects.get(username="___BenjAdmin___")
    queryset.update(creator=admin_user)

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "creator")
    actions = [assign_admin]

