from django.db import models

from projects.models import Project
from users.models import User


class Todo(models.Model):
    """Модель заметки"""
    project = models.ForeignKey(
        Project, verbose_name='проект', on_delete=models.CASCADE,
        related_name='project_todos')
    user = models.ForeignKey(
        User, verbose_name='автор заметки', on_delete=models.CASCADE,
        related_name='user_todos')
    text = models.TextField(
        verbose_name='текст', max_length=333, blank=False)
    is_active = models.BooleanField(verbose_name='активность', default=True)
    created = models.DateTimeField(verbose_name='дата создания',
                                   auto_now_add=True)
    updated = models.DateTimeField(verbose_name='дата обновления',
                                   auto_now=True, null=True, blank=True)

    def __str__(self):
        return f'{self.user} / {self.project} / {self.updated.ctime()} / ' \
               f'{self.text}'

    class Meta:
        """Пользователь не может оставить 2 одинаковые заметки к 1 проекту"""
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'
        ordering = ['is_active', '-updated', 'project']
        unique_together = (('user', 'text', 'project'),)
