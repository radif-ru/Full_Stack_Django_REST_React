from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserModelViewSet

# Роутер для авто-создания набора url-адресов (связь с id, get, set и т.д.)
router = DefaultRouter()
router.register('users', UserModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
