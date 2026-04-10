from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view

from .models import Level
from .serializers import LevelSerializer
from .permissions import IsOwner

from rest_framework.decorators import action
from rest_framework.response import Response
from authentication.models import User
from django.core import serializers
 
class OwnLevelViewset(ModelViewSet):
 
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated, IsOwner] 

    def get_queryset(self):
        # Cas all : ne retourner que les niveaux créés par l'utilisateur connecté. Cas unique : le niveau si l'utilisateur est l'auteur.
        user = self.request.user
        return Level.objects.filter(creator=user)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class LevelFromUserViewset(ModelViewSet):
    serializer_class = LevelSerializer

    def get_queryset(self):
        queryset = Level.objects.all()
        creator_name = self.request.query_params.get("creator")
        if creator_name:
            try:
                user = User.objects.get(username=creator_name)
                queryset = queryset.filter(creator=user)
            except User.DoesNotExist:
                queryset = queryset.none()
        return queryset

@api_view(['GET'])
def idsNOTOnlyForAdmin(request):
    ids = list(Level.objects.values_list('id', flat=True))
    return Response(ids)


'''class AllLevelAdminViewset(ModelViewSet):
    serializer_class = LevelSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Level.objects.all()'''