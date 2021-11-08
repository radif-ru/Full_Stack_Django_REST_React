from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet
from .models import Todo, Project
from .serializers import TodoModelSerializer, ProjectModelSerializer


# Кастомизация пагинатора заметок
class TodoPageNumberPagination(PageNumberPagination):
    # По умолчанию вывод 2 пользователей
    page_size = 20


# Кастомизация пагинатора проектов
class ProjectPageNumberPagination(PageNumberPagination):
    # По умолчанию вывод 2 пользователей
    page_size = 10


class TodoModelViewSet(ModelViewSet):
    """Набор представлений для модели заметок"""
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    queryset = Todo.objects.all()
    serializer_class = TodoModelSerializer
    pagination_class = TodoPageNumberPagination


class ProjectModelViewSet(ModelViewSet):
    """Набор представлений для модели проектов"""
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
    pagination_class = ProjectPageNumberPagination
