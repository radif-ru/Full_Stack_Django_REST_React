from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Модель пользователя"""
    first_name = models.CharField(
        verbose_name='имя', max_length=64, blank=True)
    last_name = models.CharField(
        verbose_name='фамилия', max_length=64, blank=True)
    middle_name = models.CharField('отчество', max_length=150, blank=True)
    email = models.EmailField(
        verbose_name='электронная почта', blank=True, unique=True)

    birthdate = models.DateField(
        max_length=8, verbose_name='дата рождения', blank=True, null=True)

    def __str__(self):
        return f'{self.username}'

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['last_name', 'first_name', 'middle_name', 'birthdate']
