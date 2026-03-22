from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


from .models import Level
from .serializers import LevelSerializer
 
class LevelViewset(ModelViewSet):
 
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        # Ne retourner que les niveaux créés par l'utilisateur connecté
        user = self.request.user
        return Level.objects.filter(creator=user)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)