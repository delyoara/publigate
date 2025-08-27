from rest_framework import serializers
from users.models import User, UserRole
from journals.models import JournalCommitteeMember

# Pour valider les données de connexion
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# Pour valider et créer un nouvel utilisateur
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user

# Pour afficher le profil utilisateur
class UserProfileSerializer(serializers.ModelSerializer):
    journals = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'bio', 'avatar_url',
            'affiliation', 'description', 'research_themes',
            'address', 'city', 'zipcode', 'country',
            'is_active', 'is_staff', 'is_superuser', 'date_joined',
            'journals', 'roles'
        ]
        read_only_fields = ['id', 'email', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'journals', 'roles']

    def get_journals(self, user):
        memberships = JournalCommitteeMember.objects.filter(user=user).select_related('journal')
        return [
            {
                'journal_id': m.journal.id,
                'journal_name': m.journal.name,
                'role': m.role
            }
            for m in memberships
        ]

    def get_roles(self, user):
        return [ur.role.name for ur in UserRole.objects.filter(user=user).select_related('role')]
