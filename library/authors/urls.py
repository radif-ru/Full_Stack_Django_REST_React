from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authors.views import AuthorModelViewSet

router = DefaultRouter()
router.register('author', AuthorModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
