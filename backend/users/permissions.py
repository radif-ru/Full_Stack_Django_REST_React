from rest_framework.permissions import BasePermission

from config.settings import Roles


# Кастомизация прав для пользователя
class UserPermission(BasePermission):
    def has_permission(self, request, view):
        """ Система прав
        1. Администраторы (Джанговские и из моих групп зависимостей) могут всё.
        2. Изменять данные может владелец данного аккаунта.
        3. Удалить аккаунт может владелец данного аккаунта.
        4. Создать аккаунт может любой, даже не авторизованный пользователь.
        5. Читать данные могут все. Но не все данные включены в сериализаторе
        """
        if request.method == 'PUT' or request.method == 'PATCH' or \
                request.method == 'DELETE':
            if request.user.is_authenticated:
                if 'pk' in view.kwargs and request.user.pk == int(
                        view.kwargs['pk']):
                    return True
                elif request.user.roles.filter(
                        role=Roles.ADMINISTRATOR) or request.user.is_superuser:
                    return True
            return False
        if request.method == 'POST':
            if request.user.is_anonymous:
                return True
            elif request.user.roles.filter(
                    role=Roles.ADMINISTRATOR) or request.user.is_superuser:
                return True
            return False
        return True
