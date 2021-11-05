from rest_framework import serializers

from todo.models import Project, Todo


class ProjectModelSerializer(serializers.ModelSerializer):
    """Сериализация модели проектов"""
    users = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class TodoModelSerializer(serializers.ModelSerializer):
    """Сериализация модели заметок"""
    user = serializers.StringRelatedField()
    project = serializers.StringRelatedField()

    class Meta:
        model = Todo
        exclude = ('active', 'created', 'updated')
