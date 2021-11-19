from django_filters import rest_framework as filters

from .models import Todo


# Кастомизация django-filter для Заметок
class TodoFilter(filters.FilterSet):
    # Фильтрация по дате создания заметки
    # start_date = filters.CharFilter(lookup_expr='contains')
    created = filters.DateTimeFromToRangeFilter()

    class Meta:
        model = Todo
        fields = ['created', 'project', 'project__name']
