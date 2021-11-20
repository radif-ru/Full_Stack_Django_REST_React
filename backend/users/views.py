from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, \
    RetrieveModelMixin, CreateModelMixin, DestroyModelMixin
from rest_framework.renderers import AdminRenderer
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer
from django_filters.rest_framework import DjangoFilterBackend

from .filters import UserFilter
from .mixins import UserDestroyMixin
from .models import User
from .paginators import UserLimitOffsetPagination
from .permissions import UserPermission
from .serializers import UserModelSerializer


# Понятное дело, что можно использовать просто ModelViewSet
# Но я тестировал каждый миксин отдельно, по этому подключены отдельно
class UserModelViewSet(UserDestroyMixin, ListModelMixin, RetrieveModelMixin,
                       UpdateModelMixin, CreateModelMixin, DestroyModelMixin,
                       GenericViewSet):
    """Набор представлений для модели Пользователь"""
    permission_classes = [UserPermission]
    renderer_classes = (
        # Верблюжий стиль JSON и API, и стиль удобного администрирования
        # В settings есть глобальные настройки, здесь можно корректировать
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer, AdminRenderer
    )
    queryset = User.objects.filter(is_active=1)
    serializer_class = UserModelSerializer
    # Подключение кастомного limit-offset пагинатора
    pagination_class = UserLimitOffsetPagination

    # Библиотека для фильтрации запросов django-filter + визуализация в API
    # В settings есть глобальные настройки, здесь можно корректировать
    filter_backends = [DjangoFilterBackend]
    # Подключение кастомного фильтра django-filter
    filterset_class = UserFilter

    # Пример фильтрации стандартным методом
    def get_queryset(self):
        login = self.request.query_params.get('login')
        if login is not None:
            return User.objects.filter(username__contains=login)
        else:
            return self.queryset

    # Дополнительные Endpoint-ы
    @action(detail=False, methods=['GET'])
    def superusers(self, request):
        users = User.objects.filter(is_superuser=1)
        serializer = UserModelSerializer(users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def login(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        return Response({'login': user.username})

    @action(detail=True, methods=['GET'])
    def fio(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        return Response(
            {'fio': f'{user.first_name} {user.middle_name} {user.last_name}'})
