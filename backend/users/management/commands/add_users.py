from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from scripts import load_from_json
from users.models import User


class Command(BaseCommand):
    help = 'Создание админа и пользователей'
    users = load_from_json('users')

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.create_admin()
        self.create_users(self.users)

    @staticmethod
    def create_admin() -> None:
        """Создание супер-юзера"""
        try:
            if not User.objects.filter(username='radif'):
                User.objects.create_superuser(
                    username='radif',
                    email='mail@radif.ru',
                    password='qwertytrewq').roles.add(1)
        except OperationalError or ProgrammingError as error:
            print(error)

    @staticmethod
    def create_users(users: list[dict]) -> None:
        """ Создание пользователей
        :param users: список словарей с данными пользователей
        """
        for user in users:
            try:
                if not User.objects.filter(username=user['name']):
                    User.objects.create_user(
                        username=user['name'],
                        first_name=user['first_name'],
                        last_name=user['last_name'],
                        middle_name=user['middle_name'],
                        email=user['email'],
                        birthdate=user['birthdate'],
                        password=user['password']).roles.add(2)
            except OperationalError or ProgrammingError as error:
                print(error)
