from django.db import models
from users.models import User

class Journal(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.TextField(blank=True, null=True)
    issn = models.TextField(blank=True, null=True)
    language = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    editor_in_chief = models.TextField(blank=True, null=True)
    website_url = models.TextField(blank=True, null=True)
    cover_image_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class JournalCommitteeMember(models.Model):
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.TextField(blank=True, null=True)  # 'editor', 'reviewer', etc.
    joined_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# class Issue(models.Model):
#     journal = models.ForeignKey(Journal, on_delete=models.CASCADE)
#     issue_number = models.IntegerField()
#     title = models.TextField(blank=True, null=True)
#     abstract = models.TextField(blank=True, null=True)
#     introduction = models.TextField(blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     publication_date = models.DateField(blank=True, null=True)
#     is_special = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)


# from articles.models import Article
#
# class IssueArticle(models.Model):
#     issue = models.ForeignKey(Issue, on_delete=models.SET_NULL, null=True)
#     article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
#
#     class Meta:
#         unique_together = ('issue', 'article')
#


# class IssueResponsible(models.Model):
#     issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     role = models.TextField(blank=True, null=True)
#     position = models.IntegerField(blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
