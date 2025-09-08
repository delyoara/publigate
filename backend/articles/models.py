from django.db import models

from django.db import models
from users.models import User



# --- Soumissions ---
class Submission(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.TextField()
    status = models.CharField(max_length=50, default='draft')
    submission_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ArticleStatus(models.Model):
    code = models.CharField(max_length=50, unique=True)
    label_fr = models.TextField()
    label_en = models.TextField()
    phase = models.CharField(max_length=50, choices=[
        ('submission', 'Submission'),
        ('review', 'Review'),
        ('production', 'Production'),
        ('final', 'Final')
    ])
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.code

# --- Articles ---
class Article(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.SET_NULL, null=True)
    numero_stock = models.IntegerField(unique=True)
    title = models.TextField()
    date_reception = models.DateTimeField(auto_now_add=True)
    abstract_fr = models.TextField(blank=True, null=True)
    abstract_en = models.TextField(blank=True, null=True)
    keywords = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='authored_articles')
    is_available_for_committee = models.BooleanField(default=False)
    handling_editor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='handled_articles')
    status = models.ForeignKey(ArticleStatus, on_delete=models.SET_NULL, null=True)
    version = models.IntegerField(default=1)
    issue = models.ForeignKey('journals.Issue', on_delete=models.SET_NULL, null=True)
    exceptional_status = models.TextField(blank=True, null=True)
    exceptional_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



# --- Versions d'article ---
class ArticleVersion(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    version_number = models.IntegerField()
    file_url = models.TextField()
    blind_file_url = models.TextField()
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    previous_version = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    resubmission_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# # --- Assignations éditoriales ---
class EditorAssignment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_handling_editor = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
#
# # --- Relectures ---
class Review(models.Model):
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    version = models.IntegerField()
    decision = models.CharField(max_length=50, choices=[
        ('accepted', 'Accepted'),
        ('minor modifications', 'Minor Modifications'),
        ('major modifications', 'Major Modifications'),
        ('rejected', 'Rejected')
    ])
    comments = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

 # -- Décisions éd --
class EditorialDecision(models.Model):
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    version = models.IntegerField()
    functional_role = models.TextField()
    decision = models.TextField()
    decision_letter = models.TextField()
    comments = models.TextField(blank=True, null=True)
    sent_to_author_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# --- demande de relecture ---
class ReviewAssignment(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    date_assigned = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# # --- Commentaires internes ---
class InternalComment(models.Model):
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    role = models.CharField(max_length=50, choices=[
        ('reviewer', 'Reviewer'),
        ('handling_editor', 'Handling Editor'),
        ('editor_in_chief', 'Editor-in-Chief'),
        ('associate_editor', 'Associate Editor'),
        ('committee_member', 'Committee Member'),
        ('journal_editor', 'Journal Editor'),

    ])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# --- Commentaires sur les versions ---
class VersionComment(models.Model):
    article_version = models.ForeignKey(ArticleVersion, on_delete=models.CASCADE)
    commenter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    role = models.CharField(max_length=50, choices=[
        ('reviewer', 'Reviewer'),
        ('handling_editor', 'Handling Editor'),
        ('editor_in_chief', 'Editor-in-Chief'),
        ('associate_editor', 'Associate Editor'),
        ('committee_member', 'Committee Member'),
        ('journal_editor', 'Journal Editor'),
        ('author', 'Author')
    ])

    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



# --- Documents liés à un article ---
class ArticleDocument(models.Model):
    article = models.ForeignKey(Article, on_delete=models.SET_NULL, null=True)
    document_type = models.CharField(max_length=50, choices=[
        ('appendix', 'Appendix'),
        ('figure', 'Figure'),
        ('table', 'Table'),
        ('letter', 'Letter'),
        ('publication_certificate', 'Publication Certificate'),
        ('other', 'Other')
    ])
    file_url = models.TextField()
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# --- Journal des activités ---
class ArticleActivityLog(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action_type = models.CharField(max_length=50, choices=[
        ('status_changed', 'Status Changed'),
        ('version_uploaded', 'Version Uploaded'),
        ('message_sent', 'Message Sent'),
        ('note_added', 'Note Added'),
        ('file_downloaded', 'File Downloaded')
    ])
    action_details = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
