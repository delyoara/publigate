from django.shortcuts import render
# from django.http import HttpResponse
# def home(request):
#     return HttpResponse("Viața este frumoasa 🎉")
from django.http import JsonResponse
from .models import Journal

def journals(request):
    """
    GET /api/journals/
    Renvoie la liste de toutes les revues.
    """
    if request.method == "GET":
        data = [
            {
                "id": journal.id,
                "name": journal.name,
                "acronym": journal.acronym,
                "language": journal.language,
                "description": journal.description,
                "editor_in_chief": journal.editor_in_chief,
                "cover_image_url": journal.cover_image_url,
                "website_url": journal.website_url,
             # à voir les rôles
            }
            for journal in Journal.objects.all()
        ]
        return JsonResponse(data, safe=False)

def journal_names(request):
    """
    GET /api/journals/names/
    Renvoie uniquement les noms et IDs des journaux.
    """
    if request.method == "GET":
        data = [
            {
                "id": str(journal.id),
                "name": journal.name
            }
            for journal in Journal.objects.all()
        ]
        return JsonResponse(data, safe=False, json_dumps_params={"ensure_ascii": False})

def journal_detail(request, id):
    """
    GET /api/journals/<id>/
    pour les détails d'une revue spécifique
    """
    if request.method == "GET":
        try:
            journal = Journal.objects.get(id=id)
            data = {
                "id": journal.id,
                "name": journal.name,
                "acronym": journal.acronym,
                "language": journal.language,
                "description": journal.description,
                "editor_in_chief": journal.editor_in_chief,
                "cover_image_url": journal.cover_image_url,
                "website_url": journal.website_url,
            }
            return JsonResponse(data)
        except Journal.DoesNotExist:
            return JsonResponse({"error": "Journal not found"}, status=404)
