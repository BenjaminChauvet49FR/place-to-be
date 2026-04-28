from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt import get_tokens


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request): # Note : la "requête" est un token...
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "permissions" : user.get_all_permissions()
    })

@api_view(["POST"])
def register(request):
    print(request.data)

    serializer = RegisterSerializer(data=request.data)
    # print(request.data) Utile en debug

    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens(user)

        return Response(tokens, status=201)

    return Response(serializer.errors, status=400)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer