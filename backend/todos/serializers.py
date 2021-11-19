from rest_framework import serializers

from .models import Todo


class TodoModelSerializer(serializers.ModelSerializer):
    """Сериализация модели заметок"""

    class Meta:
        model = Todo
        exclude = ('active',)
