from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from journals.models import Journal
from articles.models import Submission, Article, ArticleStatus, ArticleVersion

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_submission(request, journal_id):
    try:
        print("Utilisateur authentifié :", request.user)
        print("Cookies reçus :", request.COOKIES)
        print("Données reçues :", request.data)
        print("Fichiers reçus :", request.FILES)

        try:
            journal = Journal.objects.get(id=journal_id)
            print("Journal trouvé :", journal.name)
        except Journal.DoesNotExist:
            print("Journal introuvable avec ID :", journal_id)
            return Response({"error": "Journal introuvable."}, status=status.HTTP_404_NOT_FOUND)

        title = request.data.get("title")
        abstract_fr = request.data.get("abstract_fr")
        abstract_en = request.data.get("abstract_en")
        keywords = request.data.get("keywords")
        version_number = int(request.data.get("version", 1))
        article_file = request.FILES.get("article_pdf")
        letter_file = request.FILES.get("letter_pdf")

        print("Titre :", title)
        print("Résumé FR :", abstract_fr)
        print("Résumé EN :", abstract_en)
        print("Mots-clés :", keywords)
        print("Article PDF :", article_file)
        print("Lettre PDF :", letter_file)

        if not all([title, abstract_fr, abstract_en, article_file, letter_file]):
            print("Champs obligatoires manquants")
            return Response({"error": "Champs obligatoires manquants."}, status=status.HTTP_400_BAD_REQUEST)

        submission = Submission.objects.create(
            author=request.user,
            journal=journal,
            title=title,
            status="draft",
            submission_date=timezone.now()
        )
        print("Soumission créée :", submission.id)

        status_obj = ArticleStatus.objects.filter(code="submission").first()
        print("Statut d'article :", status_obj)

        article = Article.objects.create(
            submission=submission,
            journal=journal,
            numero_stock=Article.objects.count() + 1,
            title=title,
            abstract_fr=abstract_fr,
            abstract_en=abstract_en,
            keywords=keywords,
            author=request.user,
            status=status_obj,
            version=version_number
        )
        print("Article créé :", article.id)

        version = ArticleVersion.objects.create(
            article=article,
            version_number=version_number,
            file_pdf=article_file,
            blind_file_pdf=letter_file,
            submitted_by=request.user
        )
        print("Version enregistrée")

        return Response({
            "message": "Soumission enregistrée avec succès.",
            "submission_id": submission.id,
            "article_id": article.id,
            "article_url": version.file_pdf.url,
            "letter_url": version.blind_file_pdf.url
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Exception :", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
