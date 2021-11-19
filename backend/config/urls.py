from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, \
    TokenObtainPairView

from projects.views import ProjectModelViewSet
from todos.views import TodoModelViewSet
from users.views import UserModelViewSet

# Роутер для авто-создания набора url-адресов (связь с id, get, set и т.д.)
router = DefaultRouter()
router.register('users', UserModelViewSet)
router.register('projects', ProjectModelViewSet)
router.register('todos', TodoModelViewSet)

urlpatterns = [
    path('administration/', admin.site.urls),
    # Стандартный метод авторизации rest_framework
    path('api/auth/', include('rest_framework.urls')),
    # Стандартный метод токенизации rest_framework
    # path('api/token/', views.obtain_auth_token),

    # Аутентификация с помощью токенов JWT
    path('api/token/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    # Сброс/обновление токена JWT
    path('api/token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),

    path('api/', include(router.urls)),
]
