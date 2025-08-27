from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
import secrets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
# @permission_classes([AllowAny])
def login(request):
    ...

from journals.models import Journal, JournalCommitteeMember
from users.models import User
from users.serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer

# Générateur de token sécurisé
def generate_secure_token():
    return secrets.token_urlsafe(32)

@csrf_exempt
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Lier l'utilisateur au journal
        journal_id = request.data.get("journal_id")
        if journal_id:
            try:
                from journals.models import Journal, JournalCommitteeMember
                journal = Journal.objects.get(id=journal_id)
                JournalCommitteeMember.objects.create(
                    user=user,
                    journal=journal,
                    role="reader"  # ou "author", selon ton besoin
                )
            except Journal.DoesNotExist:
                return Response({'error': 'Journal introuvable'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Compte créé'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    journal_id = request.data.get("journal_id")  # récupéré depuis le frontend

    try:
        user = User.objects.get(email=email)
        if not check_password(password, user.password):
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

        # Association au journal si fourni
        if journal_id:
            try:
                journal = Journal.objects.get(id=journal_id)
                already_member = JournalCommitteeMember.objects.filter(user=user, journal=journal).exists()
                if not already_member:
                    JournalCommitteeMember.objects.create(user=user, journal=journal, role="reader")
            except Journal.DoesNotExist:
                return Response({'error': 'Journal introuvable'}, status=status.HTTP_400_BAD_REQUEST)

        # Génération des tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        #Sérialisation du profil
        profile = UserProfileSerializer(user)

        # Réponse avec cookies
        response = JsonResponse({
            'message': 'Connexion réussie',
            'access_token': access_token,
            'user': profile.data
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            # mettre True en production
            secure=False,
            samesite='Lax',
            domain='localhost',
            max_age=300
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            # domain='localhost',
            domain='localhost',
            max_age=86400
        )

        return response

    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    response = JsonResponse({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


@api_view(['POST'])
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if not refresh_token:
        return Response({'error': 'Token de rafraîchissement manquant'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        response = JsonResponse({'message': 'Token rafraîchi'}, status=status.HTTP_200_OK)
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=300
        )
        return response

    except TokenError:
        return Response({'error': 'Token invalide ou expiré'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me(request):
    # print("🔍 Cookies reçus dans /api/me/:", request.COOKIES)
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def request_password_reset(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
        token = generate_secure_token()
        user.reset_token = token
        user.reset_token_expiration = timezone.now() + timedelta(hours=1)
        user.save()

        reset_link = f"https://tonfrontend.com/reset-password/{token}"
        send_mail(
            "Réinitialisation de mot de passe",
            f"Cliquez ici pour réinitialiser votre mot de passe : {reset_link}",
            "noreply@tonsite.com",
            [email]
        )
        return Response({"message": "Email envoyé"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Utilisateur introuvable"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('newPassword')
    try:
        user = User.objects.get(reset_token=token)
        if user.reset_token_expiration < timezone.now():
            return Response({"error": "Token expiré"}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.reset_token = None
        user.reset_token_expiration = None
        user.save()
        return Response({"message": "Mot de passe mis à jour"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "Token invalide"}, status=status.HTTP_404_NOT_FOUND)

# pour changer le MDP
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')

    user = request.user

    if not check_password(current_password, user.password):
        return Response({'error': 'Mot de passe actuel incorrect'}, status=status.HTTP_400_BAD_REQUEST)

    if not new_password or len(new_password) < 8:
        return Response({'error': 'Le nouveau mot de passe doit contenir au moins 8 caractères'}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(new_password)
    user.save()

    return Response({'message': 'Mot de passe mis à jour avec succès'}, status=status.HTTP_200_OK)