from rest_framework.pagination import LimitOffsetPagination


# Кастомизация пагинатора пользователей
class UserLimitOffsetPagination(LimitOffsetPagination):
    # По умолчанию вывод 2 пользователей
    default_limit = 2
