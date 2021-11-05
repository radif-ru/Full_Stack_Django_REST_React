from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import User


class UserModelSerializer(serializers.ModelSerializer):
    """Сериализация модели пользователя"""

    def validate(self, attrs):
        # Разница дней между текущей датой и ДР
        days = timezone.now().date() - attrs['birthdate']
        # 365.2425 - в среднем дней в году по Григорианскому календарю
        years = days / timedelta(days=365.2425)
        if years < 18:
            raise serializers.ValidationError(
                'Школоте нельзя! Или укажи возраст больше 18 лет;)')
        return attrs

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'middle_name',
                  'email', 'birthdate')
