from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from articles.models import Article, ArticleStatus, EditorialDecision
# from users.models import User
# import json

# GET : tableau de bord de l'ed_in_chief
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def editor_in_chief_dashboard(request, journal_id):
    articles = Article.objects.filter(
        issue__journal_id=journal_id,
        status__is_active=True
    ).select_related("author", "status")

    data = [
        {
            "id": article.id,
            "title": article.title,
            "author": f"{article.author.first_name} {article.author.last_name}",
            "status": article.status.code if article.status else "non défini",
        }
        for article in articles
    ]
    return Response(data, status=status.HTTP_200_OK)

# POST pour les décisions
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editor_in_chief_decision(request, journal_id, article_id):
    decision = request.data.get("decision")
    comments = request.data.get("comments", "")
    version = request.data.get("version", 1)

    try:
        article = Article.objects.get(id=article_id, issue__journal_id=journal_id)
        if decision == "accept":
            status_obj = ArticleStatus.objects.get(code="under_review")
            article.status = status_obj
            article.is_available_for_committee = True
        elif decision == "reject":
            status_obj = ArticleStatus.objects.get(code="desk_rejected")
            article.status = status_obj
            article.is_available_for_committee = False
        else:
            return Response({"error": "Décision invalide"}, status=status.HTTP_400_BAD_REQUEST)

        article.save()

        EditorialDecision.objects.create(
            article=article,
            user=request.user,
            version=version,
            functional_role="editor_in_chief",
            decision=decision,
            decision_letter="Lettre automatique",
            comments=comments
        )

        return Response({"message": "Décision enregistrée avec succès."}, status=status.HTTP_200_OK)

    except Article.DoesNotExist:
        return Response({"error": "Article introuvable"}, status=status.HTTP_404_NOT_FOUND)
