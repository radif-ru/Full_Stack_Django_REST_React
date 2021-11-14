import os

from django.core.management.base import BaseCommand

from users.management.commands.add_users import Command as AddUsers
from users.management.commands.add_roles import Command as AddRoles


class Command(BaseCommand):
    help = 'Сборка всех подготовленных данных'

    def handle(self, *args, **options):
        self.migrate()
        self.migrate()

        AddRoles.add_groups()
        AddUsers.create_admin()
        AddUsers.create_users(AddUsers.users)

    @staticmethod
    def migrate():
        """Подготовка и выполнение миграций"""
        os.system('python manage.py makemigrations --noinput')
        os.system('python manage.py migrate --noinput')

    @staticmethod
    def collect_static():
        """Сборка стандартных и подготовленных статических файлов"""
        os.system('mkdir static')
        os.system('python manage.py collectstatic --no-input --clear')
