from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from .models import Level
from .serializers import LevelSerializer
 
class LevelViewset(ModelViewSet):
 
    serializer_class = LevelSerializer
 
    def get_queryset(self):
        return Level.objects.all()