from django_filters import rest_framework as filters

from .models import User


# Кастомизация django-filter для Пользователей
class UserFilter(filters.FilterSet):
    # Фильтрация по части имени, фамилии, отчества
    first_name = filters.CharFilter(lookup_expr='contains')
    last_name = filters.CharFilter(lookup_expr='contains')
    middle_name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'middle_name']
