from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser


from .models import Level
from .serializers import LevelSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from authentication.models import User
 
class OwnLevelViewset(ModelViewSet):
 
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        # Ne retourner que les niveaux créés par l'utilisateur connecté
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

'''class AllLevelAdminViewset(ModelViewSet):
    serializer_class = LevelSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Level.objects.all()'''