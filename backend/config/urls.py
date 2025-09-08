from django.contrib import admin
from django.urls import path
from journals import views
from users.views.auth_views import login, logout, register, refresh_token, request_password_reset, reset_password
from users.views.profile_views import me, change_password
from users.views.roles.editor_in_chief import editor_in_chief_dashboard, editor_in_chief_decision




urlpatterns = [
    # path('', home),
    path('admin/', admin.site.urls),
    # journals
    path("api/journals/", views.journals, name="journals"),
    path("api/journals/names/", views.journal_names, name="journal_names"),
    path("api/journals/<int:id>/", views.journal_detail, name="journal_detail"),
    path('api/register/', register, name='register'),
# users
    path('api/login/', login, name='login'),
    path('api/me/', me, name='me'),
    path('api/request-password-reset/', request_password_reset, name='request-password-reset'),
    path('api/reset-password/', reset_password, name='reset-password'),
    path('api/change-password/', change_password, name='change-password'),
    path('api/logout/', logout, name='logout'),
    path('api/refresh-token/', refresh_token, name='refresh-token'),

    # rôles
    path("api/journals/<int:journal_id>/editor_in_chief/", editor_in_chief_dashboard, name='editor_in_chief_dashboard'),
    # path("api/journals/<int:journal_id>/author/", author_dashboard, name='author_dashboard'),
    # path("api/journals/<int:journal_id>/reviewer/", views.reviewer_dashboard),
    # path("api/journals/<int:journal_id>/associate_editor/", views.associate_editor_dashboard),
    # path("api/journals/<int:journal_id>/reader/", views.reader_dashboard),
    # path("api/journals/<int:journal_id>/journal_editor/", views.journal_editor_dashboard),
    # path("api/journals/<int:journal_id>/handling_editor/", views.handling_editor_dashboard),

]
