from django.contrib.auth.models import AbstractUser
from django.db import models


class PermissionGroups(models.Model):
    role = models.CharField(verbose_name='роль', max_length=33, null=False,
                            unique=True)

    def __str__(self):
        return f'{self.role}'

    class Meta:
        verbose_name = 'группа разрешений'
        verbose_name_plural = 'группы разрешений'
        ordering = ['id']


class User(AbstractUser):
    """Модель пользователя"""
    first_name = models.CharField(
        verbose_name='имя', max_length=44, blank=True)
    last_name = models.CharField(
        verbose_name='фамилия', max_length=55, blank=True)
    middle_name = models.CharField('отчество', max_length=66, blank=True)
    email = models.EmailField(
        verbose_name='электронная почта', blank=True, unique=True)

    birthdate = models.DateField(
        max_length=8, verbose_name='дата рождения', blank=True, null=True)

    roles = models.ManyToManyField(PermissionGroups, verbose_name='роли')

    def __str__(self):
        return f'{self.username}'

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['roles__role', 'last_name', 'first_name', 'middle_name',
                    'birthdate']
