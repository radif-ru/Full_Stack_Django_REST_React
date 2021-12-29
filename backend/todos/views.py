from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer

from .filters import TodoFilter
from .mixins import TodoDestroyMixin
from .models import Todo
from .paginators import TodoLimitOffsetPagination
from .permissions import TodoPermission
from .serializers import TodoModelSerializer, TodoModelSerializerGet
from todos.asyncioAiohttp import get_fish_texts


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

    @action(detail=False, methods=['GET'])
    def active(self, request):
        """Получить все активные заметки без вложенных объектов"""
        todos = Todo.objects.filter(is_active=1)
        serializer = TodoModelSerializer(todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def inactive(self, request):
        """Получить все неактивные заметки без вложенных объектов"""
        todos = Todo.objects.filter(is_active=0)
        serializer = TodoModelSerializer(todos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def async_fish_todos(self, request):
        """Асинхронное (asyncio, aiohttp) получение и вывод Рыба-текстов"""
        fish_todos = get_fish_texts()
        return Response(fish_todos)
