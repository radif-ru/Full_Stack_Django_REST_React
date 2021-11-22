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
    queryset = Project.objects.filter(is_active=1)
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

