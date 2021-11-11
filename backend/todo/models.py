from django.db import models

from users.models import User


class Project(models.Model):
    """Модель проекта, для которого записаны заметки"""
    name = models.CharField(
        verbose_name='название', max_length=64, blank=False, unique=True)
    repository = models.URLField(verbose_name='url-адрес', max_length=200)
    users = models.ManyToManyField(User, verbose_name='работают с проектом')

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['name']


class Todo(models.Model):
    """Модель заметки"""
    project = models.ForeignKey(
        Project, verbose_name='проект', on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, verbose_name='автор заметки', on_delete=models.CASCADE)
    text = models.TextField(
        verbose_name='текст', max_length=999, blank=False)
    active = models.BooleanField(verbose_name='активность', default=True)
    created = models.DateTimeField(verbose_name='дата создания', auto_now_add=True)
    updated = models.DateTimeField(verbose_name='дата обновления', auto_now=True)

    def __str__(self):
        return f'{self.project}, обновлен - {self.updated}, ' \
               f'активный - {self.active}'

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'
        ordering = ['active', 'updated', 'project']
        unique_together = (('user', 'text'),)

