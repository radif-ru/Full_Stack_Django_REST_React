from rest_framework.viewsets import ModelViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer

from .filters import TodoFilter
from .mixins import TodoDestroyMixin
from .models import Todo
from .paginators import TodoLimitOffsetPagination
from .permissions import TodoPermission
from .serializers import TodoModelSerializer, TodoModelSerializerGet


class TodoModelViewSet(TodoDestroyMixin, ModelViewSet):
    """Набор представлений для модели заметок"""
    permission_classes = [TodoPermission]
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    # Вывод только активных заметок. prefetch_related() - оптимизация запросов
    queryset = Todo.objects.prefetch_related('project__users__roles',
                                             'user__roles').filter(is_active=1)
    serializer_class = TodoModelSerializer
    # Подключение кастомного пагинатора
    pagination_class = TodoLimitOffsetPagination

    # Подключение кастомного фильтра django-filter
    filterset_class = TodoFilter

    def get_serializer_class(self):
        """Если запрос Get используется соответственный сериализатор"""
        if self.request.method in ['GET']:
            return TodoModelSerializerGet
        return TodoModelSerializer
