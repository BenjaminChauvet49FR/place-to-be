from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Level
from .serializers import LevelSerializer
 
class LevelAPIView(APIView):
 
    def get(self, *args, **kwargs):
        levels = Level.objects.all()
        serializer = LevelSerializer(levels, many=True)
        return Response(serializer.data)