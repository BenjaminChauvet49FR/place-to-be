from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

from .models import Level, LevelCompletion, CompletionStatus
from .serializers import LevelSerializer, LevelMainQuestSerializer
from .permissions import IsOwner
from authentication.models import User

from django.core import serializers
from django.http import JsonResponse, HttpResponseForbidden    
from django.db import transaction
from django.db.models import Case, When, Value, IntegerField, Prefetch


 
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

    def perform_destroy(self, serializer):
        user = self.request.user
        askedPos = serializer.position
        print(serializer)
        print(askedPos)
        # Obtenir le niveau et ceux d'id > (note : on aurait pu obtenir TOUS les niveaux, mais ça rendra la transaction plus rapide...)
        level = Level.objects.filter(creator=user).filter(id=askedPos)
        levelsAfter = Level.objects.filter(creator=user).filter(position__gt=askedPos) # Note : utilisation de __gt ici https://docs.djangoproject.com/en/6.0/ref/models/querysets/
        # Position maximale
        allOrigPos = list(map(lambda lvl:lvl.position, levelsAfter))
        maxPos = 0
        if (len(allOrigPos) > 0):
            maxPos = max(allOrigPos)+1
        # Maintenant, on agit : on detruit le niveau, on decremente toutes les valeurs superieures de 1
        with transaction.atomic():

            super().perform_destroy(serializer) # https://stackoverflow.com/questions/44209878/override-serializer-delete-method-in-django-rf/44223413
            if (len(allOrigPos) > 0): 
                cases = [
                    When(position=level_nb, then=Value(level_nb - 1))
                    for level_nb in range(askedPos+1, maxPos)
                ]
                levelsAfter.update(
                    position=Case(
                        *cases,
                        output_field=IntegerField()
                    )
                )


class LevelFromUsersViewset(ModelViewSet):
    serializer_class = LevelSerializer

    def get_queryset(self):
        queryset = Level.objects.exclude(creator__username__startswith="___BenjAdmin")
        creator_name = self.request.query_params.get("creator")
        if creator_name:
            try:
                user = User.objects.get(username=creator_name)
                queryset = queryset.filter(creator=user)
            except User.DoesNotExist:
                queryset = queryset.none()
        return queryset

class LevelFromMainQuestViewSet(ModelViewSet):
    serializer_class = LevelMainQuestSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "position" # Cette ligne est TRES IMPORTANTE ! Elle permet de vérifier sur les positions et non les id. 
    
    def get_queryset(self):
        user = self.request.user

        return Level.objects.filter(creator__username__startswith="___BenjAdmin").prefetch_related(
            Prefetch(
                "completions",
                queryset=LevelCompletion.objects.filter(user=user)
            )
        )

@api_view(['GET'])
def idsGeneralPublic(request):
    ids = list(Level.objects.exclude(creator__username__startswith="___BenjAdmin").values_list('id', flat=True))
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

    # Si on tente de déplacer une liste vide... ne rien faire.
    if len(allIDRequest) == 0:
        return JsonResponse({"ok": True})


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


# Déclarer un niveau comme réussi avec un certain niveau de réussite
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def attestLevelSuccess(request):
    user = request.user
    if (not user):
        return Response(status=status.HTTP_204_NO_CONTENT)
    level = Level.objects.get(creator__username__startswith="___BenjAdmin" , position = request.data["levelNumber"])
    if (not level):
        return Response(status=status.HTTP_404_NOT_FOUND)
    levelCompletion = LevelCompletion.objects.get_or_create(
        user=user,
        level=level,
        defaults= {
            "status":request.data["status"]
        }
    )
    if (request.data["status"] == CompletionStatus.SUPER and levelCompletion.status == CompletionStatus.NORMAL):
        levelCompletion.status = CompletionStatus.SUPER # TODO A VERIFIER
        levelCompletion.save()
    # print(ok)
    return Response(status=status.HTTP_200_OK)
