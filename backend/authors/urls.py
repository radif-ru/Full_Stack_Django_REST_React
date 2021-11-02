from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authors.views import AuthorModelViewSet

# Роутер для авто-создания набора url-адресов (связь с id, get, set и т.д.)
router = DefaultRouter()
router.register('authors', AuthorModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
