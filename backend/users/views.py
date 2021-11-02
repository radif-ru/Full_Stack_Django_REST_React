from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserModelSerializer


class UserModelViewSet(ModelViewSet):
    """Набор представлений для модели Пользователь"""
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
