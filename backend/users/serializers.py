
from rest_framework import serializers
from users.models import User, UserRole, Role
from journals.models import JournalCommitteeMember, Journal

# Pour valider les données de connexion
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# Pour valider et créer un nouvel utilisateur
class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    first_name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)
    discipline = serializers.CharField(required=True)
    institution = serializers.CharField(required=False, allow_blank=True)
    affiliation = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    zipcode = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    research_themes = serializers.CharField(required=False, allow_blank=True)
    journal_id = serializers.IntegerField(required=True)

    class Meta:
        model = User
        fields = [
             'last_name', 'first_name', 'email', 'password', 'username',
            'discipline', 'research_themes',
            'institution', 'affiliation', 'address', 'city',
            'zipcode', 'country',
            'journal_id'
        ]

    def create(self, validated_data):
        journal_id = validated_data.pop('journal_id')
        password = validated_data.pop('password')

        # Création de l'utilisateur
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Récupération du journal
        try:
            journal = Journal.objects.get(id=journal_id)
        except Journal.DoesNotExist:
            raise serializers.ValidationError("Journal introuvable")

        # Attribution du rôle "author"
        try:
            from users.models import Role
            role = Role.objects.get(name="author")
        except Role.DoesNotExist:
            raise serializers.ValidationError("Le rôle 'author' n'existe pas.")

        UserRole.objects.create(user=user, role=role, journal=journal)

        return user

# Pour afficher le profil utilisateur
class UserProfileSerializer(serializers.ModelSerializer):
    journals = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'username', 'bio', 'avatar_url', 'discipline',
            'affiliation', 'description', 'research_themes',
            'address', 'city', 'zipcode', 'country',
            'is_active', 'is_staff', 'is_superuser', 'date_joined',
            'journals', 'roles'
        ]
        read_only_fields = [
            'id', 'email', 'is_active', 'is_staff', 'is_superuser',
            'date_joined', 'journals', 'roles'
        ]

    def get_journals(self, user):
        # Rôles de comité (hors author)
        committee_roles = JournalCommitteeMember.objects.filter(user=user).exclude(role="author").select_related(
            'journal')
        committee_data = [
            {
                'journal_id': m.journal.id,
                'journal_name': m.journal.name,
                'role': m.role
            }
            for m in committee_roles
        ]

        # Rôles author via UserRole
        author_roles = UserRole.objects.filter(user=user, role__name="author").select_related('journal', 'role')
        author_data = [
            {
                'journal_id': r.journal.id,
                'journal_name': r.journal.name,
                'role': r.role.name
            }
            for r in author_roles
        ]

        return committee_data + author_data

    def get_roles(self, user):
        return [ur.role.name for ur in UserRole.objects.filter(user=user).select_related('role')]
