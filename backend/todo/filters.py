from django_filters import rest_framework as filters


# Кастомизация django-filter для Проектов
from todo.models import Project, Todo


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
