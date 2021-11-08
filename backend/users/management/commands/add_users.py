import os

from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from users.models import User


class Command(BaseCommand):
    help = 'Создание админа и пользователей'
    users = [
        {'name': 'olyalya',
         'first_name': 'Olga',
         'last_name': 'Buzova',
         'middle_name': 'Kikabidze',
         'email': 'olyalya@local.ru',
         'birthdate': '1985-08-11',
         'password': 'qwertytrewq'},
        {'name': 'vas',
         'first_name': 'Vasya',
         'last_name': 'Petrov',
         'middle_name': 'Nikolayevich',
         'email': 'vasya@local.ru',
         'birthdate': '1995-06-18',
         'password': 'qwertytrewq'},
        {'name': 'irik',
         'first_name': 'Irina',
         'last_name': 'Takayato',
         'middle_name': 'Rotshildova',
         'email': 'ira@local.ru',
         'birthdate': '2005-06-26',
         'password': 'qwertytrewq'}
    ]

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.create_admin()
        self.create_users(self.users)

    def create_admin(self) -> None:
        """Создание супер-юзера"""
        try:
            if not User.objects.filter(username='radif'):
                User.objects.create_superuser(
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
                if not User.objects.filter(email=user['email']):
                    User.objects.create_user(
                        username=user['name'],
                        first_name=user['first_name'],
                        last_name=user['last_name'],
                        middle_name=user['middle_name'],
                        email=user['email'],
                        birthdate=user['birthdate'],
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
