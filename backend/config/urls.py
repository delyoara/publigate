from django.contrib import admin
from django.urls import path
from journals import views
from users.views import RegisterView
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
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
