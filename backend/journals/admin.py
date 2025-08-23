from django.contrib import admin
from .models import JournalCommitteeMember

# pt get lista memebrilor : GET /api/journals/:id/members
@admin.register(JournalCommitteeMember)
class JournalCommitteeMemberAdmin(admin.ModelAdmin):
    list_display = ('journal', 'user', 'role', 'joined_at')
    search_fields = ('user__username', 'role')
    list_filter = ('role', 'journal')
