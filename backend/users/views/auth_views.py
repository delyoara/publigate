from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
import secrets

from journals.models import Journal, JournalCommitteeMember
from users.models import User, UserRole
from users.serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer


@csrf_exempt
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    journal_id = request.data.get("journal_id")

    try:
        user = User.objects.get(email=email)
        if not check_password(password, user.password):
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)

        if journal_id:
            try:
                journal = Journal.objects.get(id=journal_id)
                already_member = JournalCommitteeMember.objects.filter(user=user, journal=journal).exists()
                if not already_member:
                    JournalCommitteeMember.objects.create(user=user, journal=journal, role="author")
            except Journal.DoesNotExist:
                return Response({'error': 'Journal introuvable'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token_value = str(refresh)

        profile = UserProfileSerializer(user)

        response = JsonResponse({
            'message': 'Connexion réussie',
            'access_token': access_token,
            'user': profile.data
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            #mettre en True en prod
            secure=False,
            samesite='Lax',

            max_age=300
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token_value,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400
        )

        return response

    except User.DoesNotExist:
        return Response({'error': 'Utilisateur introuvable'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def logout(request):
    response = JsonResponse({'message': 'Déconnexion réussie'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


def generate_secure_token():
    return secrets.token_urlsafe(32)


@csrf_exempt
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        journal_id = request.data.get("journal_id")
        if journal_id:
            try:
                journal = Journal.objects.get(id=journal_id)
                UserRole.objects.create(user=user, journal=journal, role="author")
            except Journal.DoesNotExist:
                return Response({'error': 'Journal introuvable'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token_value = str(refresh)
        profile = UserProfileSerializer(user)

        response = JsonResponse({
            'message': 'Inscription réussie',
            'access_token': access_token,
            'user': profile.data
        }, status=status.HTTP_201_CREATED)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=300
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh_token_value,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=86400
        )

        return response

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def refresh_token(request):
    refresh_token_value = request.COOKIES.get('refresh_token')
    if not refresh_token_value:
        return Response({'error': 'Token de rafraîchissement manquant'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        refresh = RefreshToken(refresh_token_value)
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
