from django.db import models

from users.models import User


class Project(models.Model):
    """Модель проекта, для которого записаны заметки"""
    name = models.CharField(
        verbose_name='название', max_length=33, blank=False, unique=True)
    repository = models.URLField(
        verbose_name='репозиторий (url-адрес)', max_length=99)
    users = models.ManyToManyField(User, verbose_name='работают с проектом')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['name']
