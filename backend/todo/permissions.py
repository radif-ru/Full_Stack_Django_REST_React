from rest_framework.permissions import BasePermission

from config.settings import Roles


# Кастомизация прав для заметок
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


# Кастомизация прав для проектов
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
