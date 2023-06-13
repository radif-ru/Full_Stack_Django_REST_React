from django.core.mail import send_mail
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from config.settings import DOMAIN_NAME, EMAIL_HOST_USER, TODOS_ENDPOINT
from todos.models import Todo


@receiver(post_save, sender=Todo, dispatch_uid='todos_email_sender_create_upd')
def forwarding_to_save(instance, created, **kwargs):
    if created:
        email_sender(instance, 'Создана')
    email_sender(instance, 'Изменена')


@receiver(pre_delete, sender=Todo, dispatch_uid='todos_email_sender_delete')
def forwarding_to_delete(instance, **kwargs):
    email_sender(instance, 'Удалена')


def email_sender(instance: Todo, text: str) -> None:
    """ Почтовая рассылка
    Письмо направляется создателю заметки
    """
    if instance.pk:
        recipient_list = [instance.user.email]

        login = instance.user.username
        project_name = instance.project.name
        todo_text = instance.text
        updated = instance.updated
        todo_link = f'{DOMAIN_NAME}{TODOS_ENDPOINT}{instance.pk}/'

        if not instance.is_active:
            text = 'Удалена'

        title = f'{text} заметка для проекта "{project_name}"'

        message = f'{text} заметка для проекта "{project_name}"\n\n' \
                  f'Дата: {updated}\n\n' \
                  f'Владелец заметки:\n' \
                  f'{login}\n\n' \
                  f'Текст заметки:\n' \
                  f'{todo_text}\n\n' \
                  f'Ссылка на заметку:\n' \
                  f'{todo_link}'

        send_mail(
            title, message, EMAIL_HOST_USER, recipient_list,
            fail_silently=False
        )
