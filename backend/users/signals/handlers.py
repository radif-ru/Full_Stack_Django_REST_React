from django.core.mail import send_mail
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from config.settings import DOMAIN_NAME, EMAIL_HOST_USER, USERS_ENDPOINT
from users.models import User


@receiver(post_save, sender=User, dispatch_uid='users_email_sender_create_upd')
def forwarding_to_save(instance, created, **kwargs):
    if created:
        email_sender(instance, 'Создан')
    email_sender(instance, 'Изменён')


@receiver(pre_delete, sender=User, dispatch_uid='users_email_sender_delete')
def forwarding_to_delete(instance, **kwargs):
    email_sender(instance, 'Удалён')


def email_sender(instance: User, text: str) -> None:
    """ Почтовая рассылка
    Письмо направляется владельцу аккаунта
    """
    if instance.pk:
        recipient_list = [instance.email]

        login = instance.username
        first_name = instance.first_name
        last_name = instance.last_name
        middle_name = instance.middle_name
        email = instance.email
        birthdate = instance.email
        roles = [role.role for role in instance.roles.all()]
        updated = instance.updated
        last_login = instance.last_login

        user_link = f'{DOMAIN_NAME}{USERS_ENDPOINT}{instance.pk}/'

        if not instance.is_active:
            text = 'Удалён'

        title = f'{text} аккаунт владельца под логином - "{login}"'

        message = f'{text} аккаунт владельца под логином - "{login}"\n\n' \
                  f'Дата изменений данных: {updated}\n\n' \
                  f'Последний вход в систему: {last_login}\n\n' \
                  f'Фамилия: {last_name}\n\n' \
                  f'Имя: {first_name}\n\n' \
                  f'Отчество: {middle_name}\n\n' \
                  f'Электронная почта: {email}\n\n' \
                  f'День рождения: {birthdate}\n\n' \
                  f'Роли пользователя: {roles}\n\n' \
                  f'Ссылка на пользователя:\n' \
                  f'{user_link}'

        send_mail(
            title, message, EMAIL_HOST_USER, recipient_list,
            fail_silently=False
        )
