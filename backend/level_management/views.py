from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

from .models import Level
from .serializers import LevelSerializer
from .permissions import IsOwner
from authentication.models import User

from django.core import serializers
from django.http import JsonResponse, HttpResponseForbidden    
from django.db import transaction
from django.db.models import Case, When, Value, IntegerField

 
class OwnLevelViewset(ModelViewSet):
 
    serializer_class = LevelSerializer
    permission_classes = [IsAuthenticated, IsOwner] 

    def get_queryset(self):
        # Cas all : ne retourner que les niveaux créés par l'utilisateur connecté. Cas unique : le niveau si l'utilisateur est l'auteur.
        user = self.request.user
        return Level.objects.filter(creator=user)
    
    def perform_create(self, serializer):
        user = self.request.user
        allPos = map(lambda lvl:lvl.position, Level.objects.filter(creator=user))
        serializer.save(creator=self.request.user, position=max(allPos)+1)

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

# Donne à tous les niveaux de l'utilisateur une position (à partir de 1) selon l'ordre des ID fourni dans le corps de la requête
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reorder(request):
    allIDRequest = request.data["idList"]

    qs = Level.objects.filter(creator=request.user)
    expectedIDs = set(qs.values_list("id", flat=True))

    # On ne resquille pas ! Vérification que les ID fournis sont une permutation des ID des niveaux du user :
    if len(allIDRequest) != len(expectedIDs):
        return HttpResponseForbidden()

    if set(allIDRequest) != expectedIDs:
        return HttpResponseForbidden()

    allOrigPos = list(map(lambda lvl:lvl.position, qs))
    maxPos = max(allOrigPos)+1

    with transaction.atomic():

        # Positions temporaires (parce que les clés doivent être uniques)
        temp_cases = [
            When(id=level_id, then=Value(maxPos + i))
            for i, level_id in enumerate(allIDRequest, start=1)
        ]
        qs.update(
            position=Case(
                *temp_cases,
                output_field=IntegerField()
            )
        )

        # Positions réelles (1,2,3... selon l'ordre fourni par les id)
        final_cases = [
            When(id=level_id, then=Value(i))
            for i, level_id in enumerate(allIDRequest, start=1)
        ]
        qs.update(
            position=Case(
                *final_cases,
                output_field=IntegerField()
            )
        )

    return JsonResponse({"ok": True})

