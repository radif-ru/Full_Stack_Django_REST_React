from rest_framework import serializers

from projects.serializers import ProjectModelSerializerGet
from users.serializers import UserModelSerializer
from .models import Todo


class TodoModelSerializer(serializers.ModelSerializer):
    """Сериализация модели заметок"""

    class Meta:
        model = Todo
        exclude = ('is_active', 'created', 'updated')


class TodoModelSerializerGet(TodoModelSerializer):
    """Сериализация модели заметок. Используется для GET - запросов
    Отличие от основного, в том, что данные пользователей и проектов выдаются
    в виде словарей с включёнными данными, по иерархии вглубь, а не только id
    """

    project = ProjectModelSerializerGet()
    user = UserModelSerializer()
