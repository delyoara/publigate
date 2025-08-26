from django.contrib import admin
from django.urls import path
from journals import views
from users.views import register, login, me, request_password_reset, reset_password, change_password
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # path('', home),
    path('admin/', admin.site.urls),
    # journals
    path("api/journals/", views.journals, name="journals"),
    path("api/journals/names/", views.journal_names, name="journal_names"),
    path("api/journals/<int:id>/", views.journal_detail, name="journal_detail"),
    path('api/register/', register, name='register'),

    path('api/login/', login, name='login'),
    path('api/me/', me, name='me'),
    path('api/request-password-reset/', request_password_reset, name='request-password-reset'),
    path('api/reset-password/', reset_password, name='reset-password'),
    path('api/change-password/', change_password, name='change-password'),


    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
