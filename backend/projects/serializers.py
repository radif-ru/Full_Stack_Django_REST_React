from rest_framework import serializers

from users.serializers import UserModelSerializer
from .models import Project


class ProjectModelSerializer(serializers.ModelSerializer):
    """Сериализация модели проектов"""

    class Meta:
        model = Project
        exclude = ('is_active', 'created', 'updated')
