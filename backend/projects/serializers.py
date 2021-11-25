from rest_framework import serializers

from users.serializers import UserModelSerializer
from .models import Project


class ProjectModelSerializer(serializers.ModelSerializer):
    """Сериализация модели проектов"""

    class Meta:
        model = Project
        exclude = ('is_active', 'created', 'updated')


class ProjectModelSerializerGet(ProjectModelSerializer):
    """Сериализация модели проектов. Используется для GET - запросов
    Отличие от основного, в том, что данные пользователей выдаются в виде
    словарей с включёнными данными, по иерархии вглубь, а не только id
    """

    users = UserModelSerializer(many=True)


class ProjectModelSerializerV2(ProjectModelSerializer):
    """Сериализация модели проектов. Версия 2"""

    users = serializers.StringRelatedField(many=True)
