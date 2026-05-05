"""
URL configuration for place_to_be project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from level_management.views import *
from authentication.views import *
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView 
from django.http import JsonResponse


# Ici nous créons notre routeur
router = routers.SimpleRouter()
# Puis lui déclarons une url basée sur le mot clé level et notre view
# afin que l’url générée soit celle que nous souhaitons ‘/api/level/’
router.register('myLevels', OwnLevelViewset, basename='myLevels')
router.register('levelsGeneralPublic', LevelFromUsersViewset, basename='levels')
router.register('levelsMainQuest', LevelFromMainQuestViewSet, basename='levelsMQ')
router.register('level', OwnLevelViewset, basename='level') 
router.register('allLevelsAdmin', AllLevelsAdminViewset, basename='allLevels') # TODO wanting a route for all levels and a route for detail is not so bad

def ping(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Router (ci-dessus)
    path('api/', include(router.urls)),  # Il faut bien penser à ajouter les urls du router dans la liste des urls disponibles.
    
    # Auth
    path('api/login/', login_view, name='login'),
    path('api/refresh/', refresh_cookie, name='refresh'),
    path('api/logout/', logout_view, name='logout'),
    path('api/me/', me, name='me'),
    path('api/ping/', ping, name='ping'),
    path('api/register/', register, name='register'),
   
    # Manipulations sur niveaux
    path('api/reorder/', reorder, name='reorder'),

    # Succès niveau
    path('api/attestSuccess/', attestLevelSuccess, name='attest')    
]
