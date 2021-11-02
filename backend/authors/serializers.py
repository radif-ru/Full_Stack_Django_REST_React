from rest_framework.serializers import HyperlinkedModelSerializer
from .models import Author


class AuthorModelSerializer(HyperlinkedModelSerializer):
    """Сериализация модели пользователя Автор"""
    class Meta:
        model = Author
        fields = ('username', 'first_name', 'last_name', 'middle_name',
                  'email', 'birthdate')
