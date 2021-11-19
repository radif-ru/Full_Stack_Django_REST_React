from django_filters import rest_framework as filters

from .models import Project


# Кастомизация django-filter для Проектов
class ProjectFilter(filters.FilterSet):
    # Фильтрация по части названия проекта
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = Project
        fields = ['name']
