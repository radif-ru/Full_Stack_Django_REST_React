import os

from django.core.management.base import BaseCommand

from django.db import OperationalError, ProgrammingError

from authors.models import Author


class Command(BaseCommand):
    help = 'Создание админа и пользователей'
    users = [
        {'name': 'Kolya',
         'password': 'qwertytrewq',
         'email': 'kolya@local.ru'},
        {'name': 'Vasya',
         'password': 'qwertytrewq',
         'email': 'vasya@local.ru'},
        {'name': 'Ira',
         'password': 'qwertytrewq',
         'email': 'ira@local.ru'}
    ]

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.create_admin()
        self.create_users(self.users)

    def create_admin(self) -> None:
        """Создание супер-юзера"""
        try:
            if not Author.objects.filter(username='radif'):
                Author.objects.create_superuser(
                    username='radif',
                    email='mail@radif.ru',
                    password='qwertytrewq')
        except OperationalError or ProgrammingError:
            self.migrate()
            self.collect_static()
            self.create_admin()

    def create_users(self, users: list[dict]) -> None:
        """ Создание пользователей
        :param users: список словарей с данными пользователей
        """
        for user in users:
            try:
                if not Author.objects.filter(email=user['email']):
                    Author.objects.create_superuser(
                        username=user['name'],
                        email=user['email'],
                        password=user['password'])
            except OperationalError or ProgrammingError:
                self.create_admin()

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
