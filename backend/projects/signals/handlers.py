from django.core.mail import send_mail
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from config.settings import DOMAIN_NAME, EMAIL_HOST_USER, PROJECTS_ENDPOINT
from projects.models import Project


@receiver(post_save, sender=Project,
          dispatch_uid='projects_email_sender_create_upd')
def forwarding_to_save(instance, created, **kwargs):
    if created:
        email_sender(instance, 'Создан')
    email_sender(instance, 'Изменён')


@receiver(pre_delete, sender=Project,
          dispatch_uid='projects_email_sender_delete')
def forwarding_to_delete(instance, **kwargs):
    email_sender(instance, 'Удалён')


def email_sender(instance: Project, text: str) -> None:
    """ Почтовая рассылка
    Письма направляются всем владельцам проекта
    """
    if instance.pk:
        subscriptions = instance.users.all()
        recipient_list = [sub.email for sub in subscriptions]

        product_owners = [sub.username for sub in subscriptions]
        project_name = instance.name
        updated = instance.updated
        repository_link = instance.repository
        project_link = f'{DOMAIN_NAME}{PROJECTS_ENDPOINT}{instance.pk}/'

        title = f'{text} проект "{project_name}"'

        message = f'{text} проект "{project_name}"\n\n' \
                  f'Дата: {updated}\n\n' \
                  f'Владельцы проекта:\n' \
                  f'{product_owners}\n\n' \
                  f'Ссылка на репозиторий:\n' \
                  f'{repository_link}\n\n' \
                  f'Ссылка на проект:\n' \
                  f'{project_link}'

        send_mail(
            title, message, EMAIL_HOST_USER, recipient_list,
            fail_silently=False
        )
