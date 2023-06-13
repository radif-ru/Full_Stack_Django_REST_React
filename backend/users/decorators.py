"""Декораторы пользователей"""
import functools
from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers


def is_young_serializer_validate_decorator(method):
    """ Декоратор проверяет возраст пользователя.
    На основе этого выдаёт разрешение на регистрацию
    """

    @functools.wraps(method)
    def wrapper(self, attrs):
        if 'birthdate' in attrs and attrs['birthdate']:
            # Разница дней между текущей датой и ДР
            days = timezone.now().date() - attrs['birthdate']
            # 365.2425 - в среднем дней в году по Григорианскому календарю
            years = days / timedelta(days=365.2425)
            if years < 18:
                raise serializers.ValidationError(
                    'Школоте нельзя! Или укажи возраст больше 18 лет;)')
        return attrs

    return wrapper
