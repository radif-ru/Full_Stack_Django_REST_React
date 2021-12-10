from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer

from .filters import ProjectFilter
from .mixins import ProjectDestroyMixin
from .models import Project
from .paginators import ProjectLimitOffsetPagination
from .permissions import ProjectPermission
from .serializers import ProjectModelSerializer, ProjectModelSerializerGet, \
    ProjectModelSerializerV2


class ProjectModelViewSet(ProjectDestroyMixin, ModelViewSet):
    """Набор представлений для модели проектов"""
    permission_classes = [ProjectPermission]
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    # prefetch_related() - оптимизация запросов
    queryset = Project.objects.prefetch_related(
        'users', 'users__roles').filter(is_active=1)
    serializer_class = ProjectModelSerializer
    # Подключение кастомного пагинатора
    pagination_class = ProjectLimitOffsetPagination
    # Подключение кастомного фильтра django-filter
    filterset_class = ProjectFilter

    def get_serializer_class(self):
        """Система контроля версий + обработка типов запросов"""
        if self.request.version == '2.0':
            return ProjectModelSerializerV2

        # Если запрос Get используется соответственный сериализатор
        if self.request.method in ['GET']:
            return ProjectModelSerializerGet
        return ProjectModelSerializer

    @action(detail=False, methods=['GET'])
    def active(self, request):
        """Получить все активные проекты без вложенных объектов"""
        projects = Project.objects.filter(is_active=1)
        serializer = ProjectModelSerializer(projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def inactive(self, request):
        """Получить все неактивные проекты без вложенных объектов"""
        projects = Project.objects.filter(is_active=0)
        serializer = ProjectModelSerializer(projects, many=True)
        return Response(serializer.data)
