from django.contrib import admin
from django.urls import path
from journals import views
from users.views.auth_views import login, logout, register, refresh_token, request_password_reset, reset_password
from users.views.profile_views import me, change_password


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

]
