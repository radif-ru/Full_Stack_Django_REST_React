from django.db import models

from users.models import User


class Project(models.Model):
    """Модель проекта, для которого записаны заметки"""
    name = models.CharField(
        verbose_name='название', max_length=33, blank=False, null=False)
    repository = models.URLField(
        verbose_name='репозиторий (url-адрес)', max_length=99, default='')
    users = models.ManyToManyField(User, verbose_name='работают с проектом',
                                   related_name='user_projects')
    is_active = models.BooleanField(verbose_name='активность', default=True)
    created = models.DateTimeField(verbose_name='дата создания',
                                   auto_now_add=True)
    updated = models.DateTimeField(verbose_name='дата обновления',
                                   auto_now=True, null=True, blank=True)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['is_active', '-created', 'name']
        unique_together = (('name', 'repository', 'updated'),)
