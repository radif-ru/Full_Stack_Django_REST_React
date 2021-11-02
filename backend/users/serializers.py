from rest_framework.serializers import HyperlinkedModelSerializer
from .models import User


class UserModelSerializer(HyperlinkedModelSerializer):
    """Сериализация модели пользователя Автор"""
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'middle_name',
                  'email', 'birthdate')
