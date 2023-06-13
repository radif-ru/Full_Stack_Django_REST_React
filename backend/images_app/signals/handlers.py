import os

from django.db.models.signals import post_delete
from django.dispatch import receiver

from images_app.models import Image


@receiver(post_delete, sender=Image, dispatch_uid='image_delete')
def image_delete(sender, instance, **kwargs) -> None:
    """ Физическое удаление файла из носителя """
    try:
        os.remove(instance.picture.path)
    except FileNotFoundError:
        print('Файл не найден')
    except Exception as error:
        print(f'Ошибка: {error}')
