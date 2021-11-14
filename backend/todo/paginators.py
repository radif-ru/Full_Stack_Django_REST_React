from rest_framework.pagination import LimitOffsetPagination


# Кастомизация пагинатора заметок
class TodoLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 20 заметок
    default_limit = 20


# Кастомизация пагинатора проектов
class ProjectLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 10 проектов
    default_limit = 10
