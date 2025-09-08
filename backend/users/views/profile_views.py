from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password

from users.models import UserRole
from users.serializers import UserProfileSerializer


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == 'GET':
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
