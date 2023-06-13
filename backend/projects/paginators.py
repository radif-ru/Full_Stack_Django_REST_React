from rest_framework.pagination import LimitOffsetPagination


# Кастомизация пагинатора проектов
class ProjectLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 10 проектов
    default_limit = 10
