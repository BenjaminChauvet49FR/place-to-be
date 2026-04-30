from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt import get_tokens
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request): # Note : la "requête" est un token...
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "permissions" : user.get_all_permissions()
    })

# Création user

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

# Connexion

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        print("User none !s")
        return Response(
            {"detail": "Invalid credentials"},
            status=401
        )

    refresh = RefreshToken.for_user(user)

    response = Response({
        "access": str(refresh.access_token),
        "permissions" : user.get_all_permissions()
    })

    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=settings.COOKIE_SECURE,   # True en prod HTTPS, False en local ; signifie que le cookie n'est envoyé qu'en HTTPS.
        samesite="None"
    )

    return response

# Refresh

@api_view(["POST"])
def refresh_cookie(request):
    token = request.COOKIES.get("refresh_token")

    if not token:
        return Response({"detail": "No token"}, status=401)

    try:
        refresh = RefreshToken(token)

        return Response({
            "access": str(refresh.access_token)
        })

    except Exception:
        return Response({"detail": "Invalid token"}, status=401)

# Déconnexion

@api_view(["POST"])
def logout_view(request):
    response = Response({"detail": "Logged out"})
    response.delete_cookie("refresh_token")
    return response