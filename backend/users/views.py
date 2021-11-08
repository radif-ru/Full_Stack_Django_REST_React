from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, \
    RetrieveModelMixin
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.renderers import AdminRenderer
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer

from .models import User
from .serializers import UserModelSerializer


# Кастомизация пагинатора пользователей
class UserLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 2 пользователей
    default_limit = 2


class UserModelViewSet(ListModelMixin, UpdateModelMixin, RetrieveModelMixin,
                       GenericViewSet):
    """Набор представлений для модели Пользователь"""
    renderer_classes = (
        # Верблюжий стиль JSON и API, и стиль удобного администрирования
        # В settings есть глобальные настройки, здесь можно корректировать
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer, AdminRenderer
    )
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    pagination_class = UserLimitOffsetPagination

    # Библиотека для фильтрации запросов django-filter + визуализация в API
    # В settings есть глобальные настройки, здесь можно корректировать
    filter_backends = [DjangoFilterBackend]
    # поле по которому фильтруем с помощью библиотеки django-filter
    filterset_fields = ['first_name', 'last_name', 'middle_name']

    # Пример фильтрации стандартным методом
    def get_queryset(self):
        login = self.request.query_params.get('login')
        if login is not None:
            return User.objects.filter(username=login)
        else:
            return User.objects.all()

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
            {'fio': f'{user.username} {user.middle_name} {user.last_name}'})
