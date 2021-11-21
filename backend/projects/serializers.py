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
    словарей со всеми данными, по всей иерархии вглубь, а не только id
    """

    # users = serializers.StringRelatedField(many=True)
    users = UserModelSerializer(many=True)
