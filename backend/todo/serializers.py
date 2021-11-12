from rest_framework import serializers

from todo.models import Project, Todo


class ProjectModelSerializer(serializers.ModelSerializer):
    """Сериализация модели проектов"""
    # users = serializers.StringRelatedField(many=True)
    # users = UserModelSerializer(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class TodoModelSerializer(serializers.ModelSerializer):
    """Сериализация модели заметок"""

    class Meta:
        model = Todo
        exclude = ('active',)
