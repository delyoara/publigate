from django.test import TestCase
from django.core.exceptions import ValidationError
from users.models import User

class EmailValidationTest(TestCase):
    def test_email_case_insensitive_uniqueness(self):
        # Création du premier utilisateur avec un email en majuscules
        User.objects.create(
            email="Test@Email.com",
            username="user1",
            password="Paris123"
        )

        # Tentative de création d'un second utilisateur avec le même email en minuscules
        user = User(
            email="test@email.com",
            username="user2",
            password="Paris456"
        )

        try:
            user.full_clean()
            self.fail("Validation should have failed due to duplicate email")
        except ValidationError as e:
            self.assertIn('email', e.message_dict)
