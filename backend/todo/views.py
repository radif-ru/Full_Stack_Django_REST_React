from rest_framework.viewsets import ModelViewSet
from .models import Todo, Project
from .serializers import TodoModelSerializer, ProjectModelSerializer


class TodoModelViewSet(ModelViewSet):
    """Набор представлений для модели заметок"""
    queryset = Todo.objects.all()
    serializer_class = TodoModelSerializer


class ProjectModelViewSet(ModelViewSet):
    """Набор представлений для модели проектов"""
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
