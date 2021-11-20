from rest_framework.permissions import BasePermission

from config.settings import Roles


# Кастомизация прав для заметок
class TodoPermission(BasePermission):
    def has_permission(self, request, view):
        """ Система прав
        1. Администраторы (Джанговские и из моих групп зависимостей) могут всё.
        2. Изменять данные может создатель заметки.
        3. Удалить заметку может её создатель.
        4. Создать заметку может любой пользователь, если авторизован.
        5. Читать данные могут все. Но не все данные включены в сериализаторе
        """
        if request.method == 'PUT' or request.method == 'PATCH' \
                or request.method == 'DELETE':
            if request.user.is_authenticated:
                if view.get_object().user.pk == request.user.pk:
                    return True
                elif request.user.roles.filter(
                        role=Roles.ADMINISTRATOR) or request.user.is_superuser:
                    return True
            return False
        if request.method == 'POST':
            if request.user.is_authenticated:
                return True
            return False
        return True
