from django.db import models

from config.settings import IMAGES_UPLOAD_DIRECTORY


class Image(models.Model):
    name = models.CharField(verbose_name='имя', max_length=999, null=True,
                            blank=True)
    url = models.URLField(
        verbose_name='ссылка на внешний ресурс', max_length=999, null=True)
    picture = models.ImageField(verbose_name='где хранится файл',
                                upload_to=IMAGES_UPLOAD_DIRECTORY)
    parent_picture = models.ForeignKey('self',
                                       verbose_name='родительское изображение',
                                       on_delete=models.CASCADE,
                                       null=True)

    class Meta:
        verbose_name = 'Изображение'
        verbose_name_plural = 'Изображения'
        ordering = ['-id']
