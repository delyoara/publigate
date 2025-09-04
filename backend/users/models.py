from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
import typing
if typing.TYPE_CHECKING:
    from journals.models import JournalCommitteeMember

class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    reset_token = models.TextField(blank=True, null=True)
    discipline = models.CharField(max_length=200, blank=True, null=True)
    reset_token_expiration = models.DateTimeField(blank=True, null=True)
    research_themes = models.TextField(blank=True, null=True)
    institution = models.CharField(max_length=255, blank=True, null=True)
    affiliation = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    zipcode = models.CharField(max_length=25, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
 # Vérifie qu'aucun autre utilisateur n'a le même email (insensible à la casse)
        if User.objects.filter(email__iexact=self.email).exclude(pk=self.pk).exists():
            raise ValidationError({'email': 'Cet email est déjà utilisé.'})

    def save(self, *args, **kwargs):
        # Force l'email et le username en minuscules
        if self.email:
            self.email = self.email.lower()
        if self.username:
            self.username = self.username.lower()
        self.full_clean()  # Lance la validation avant d'enregistrer
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    @property
    def journal_roles_display(self):
        return [
            f"{member.journal.name} : {member.role}"
            for member in JournalCommitteeMember.objects.filter(user=self)
        ]

class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    label_en = models.TextField(blank=True, null=True)
    label_fr = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('role', 'permission')

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    journal = models.ForeignKey('journals.Journal', on_delete=models.CASCADE, null=True, blank=True)


    class Meta:
        unique_together = ('user', 'role', 'journal')

