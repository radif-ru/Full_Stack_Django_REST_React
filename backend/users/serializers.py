from rest_framework import serializers

from projects.models import Project
from todos.models import Todo
from .decorators import is_young_serializer_validate_decorator
from .models import User, PermissionGroups


class PermissionGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroups
        fields = '__all__'


class UserModelSerializer(serializers.ModelSerializer):
    """Сериализация модели пользователя"""
    password = serializers.CharField(
        max_length=128, write_only=True, allow_blank=False)

    def create(self, *args, **kwargs):
        user = super().create(*args, **kwargs)
        password = user.password
        user.set_password(password)
        user.save()
        return user

    def update(self, *args, **kwargs):
        user = super().update(*args, **kwargs)
        password = user.password
        user.set_password(password)
        user.save()
        return user

    @is_young_serializer_validate_decorator
    def validate(self, attrs):
        return attrs

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'middle_name',
                  'email', 'birthdate', 'roles', 'password')


class ProjectSetModelSerializer(serializers.ModelSerializer):
    """Сериализация связанной модели проектов для пользователей"""

    class Meta:
        model = Project
        fields = '__all__'


class TodoSetModelSerializer(serializers.ModelSerializer):
    """Сериализация связанной модели заметок для пользователей"""

    class Meta:
        model = Todo
        fields = '__all__'


class UserModelSerializerGet(UserModelSerializer):
    """Сериализация модели пользователя. Используется для GET - запросов
    Отличие от основного, в том, что данные групп с ролями выдаются в виде
    словарей с включёнными данными, по иерархии вглубь, а не только id.

    Постфикс _set позволяет получить связанные объекты, но я изменил их имена в
    моделях, добавив related_name=... к полям связанных объектов моделей.
    Вместо user_todos было бы todo_set, вместо user_projects - project_set.
    Точно так же выдаются связанные поля моделей и проектов каждого
    пользователя, а не только id.
    """

    roles = PermissionGroupsSerializer(many=True)
    user_projects = ProjectSetModelSerializer(many=True, read_only=True)
    user_todos = TodoSetModelSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'middle_name',
                  'email', 'birthdate', 'roles', 'password', 'user_todos',
                  'user_projects')
