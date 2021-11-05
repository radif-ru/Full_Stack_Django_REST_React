from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer
from rest_framework.renderers import AdminRenderer
from rest_framework.viewsets import ModelViewSet
from .models import Todo, Project
from .serializers import TodoModelSerializer, ProjectModelSerializer


class TodoModelViewSet(ModelViewSet):
    """Набор представлений для модели заметок"""
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    queryset = Todo.objects.all()
    serializer_class = TodoModelSerializer


class ProjectModelViewSet(ModelViewSet):
    """Набор представлений для модели проектов"""
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
