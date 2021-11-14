from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import BasePermission
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer
from django_filters import rest_framework as filters

from config.settings import Roles
from .models import Todo, Project
from .serializers import TodoModelSerializer, ProjectModelSerializer


# Кастомизация пагинатора заметок
class TodoLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 20 заметок
    default_limit = 20


# Кастомизация пагинатора проектов
class ProjectLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 10 проектов
    default_limit = 10


# Кастомизация django-filter для Проектов
class ProjectFilter(filters.FilterSet):
    # Фильтрация по части названия проекта
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = Project
        fields = ['name']


# Кастомизация django-filter для Заметок
class TodoFilter(filters.FilterSet):
    # Фильтрация по дате создания заметки
    # start_date = filters.CharFilter(lookup_expr='contains')
    created = filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Todo
        fields = ['created', 'project', 'project__name']


# Кастомизация прав для пользователя
class TodoPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'PUT' or \
                request.method == 'PATCH':
            if request.user.is_authenticated:
                return request.user.roles.filter(
                    role=Roles.DEVELOPER) or request.user.roles.filter(
                    role=Roles.PROJECT_OWNER) or request.user.roles.filter(
                    role=Roles.ADMINISTRATOR) or request.user.is_superuser
            return False
        return True


# Кастомизация прав для пользователя
class ProjectPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'PUT' or \
                request.method == 'PATCH':
            if request.user.is_authenticated:
                return request.user.roles.filter(
                    role=Roles.PROJECT_OWNER) or request.user.roles.filter(
                    role=Roles.ADMINISTRATOR) or request.user.is_superuser
            return False
        return True


class TodoModelViewSet(ModelViewSet):
    """Набор представлений для модели заметок"""
    permission_classes = [TodoPermission]
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    # Вывод только активных заметок
    queryset = Todo.objects.filter(active=1)
    serializer_class = TodoModelSerializer
    # Подключение кастомного пагинатора
    pagination_class = TodoLimitOffsetPagination

    # Подключение кастомного фильтра django-filter
    filterset_class = TodoFilter

    def destroy(self, request, *args, **kwargs):
        """ Переопределения метода удаления (DELETE)
        Вместо фактического удаления меняем активность на 0 (False)
        """
        instance = self.get_object()
        instance.active = 0
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectModelViewSet(ModelViewSet):
    """Набор представлений для модели проектов"""
    permission_classes = [ProjectPermission]
    renderer_classes = (
        # Верблюжий стиль JSON и браузерного API
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer
    )
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
    # Подключение кастомного пагинатора
    pagination_class = ProjectLimitOffsetPagination
    # Подключение кастомного фильтра django-filter
    filterset_class = ProjectFilter
