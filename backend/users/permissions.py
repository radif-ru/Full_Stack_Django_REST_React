from rest_framework.permissions import BasePermission

from config.settings import Roles


# Кастомизация прав для пользователя
class UserPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST' or request.method == 'PUT' or \
                request.method == 'PATCH':
            if request.user.is_authenticated:
                return request.user.roles.filter(
                    role=Roles.ADMINISTRATOR) or request.user.is_superuser
            return False
        return True
