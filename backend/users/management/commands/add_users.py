import random

from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from scripts import load_from_json
from users.models import User, PermissionGroups


class Command(BaseCommand):
    help = 'Создание админа и пользователей'
    users = load_from_json('users')

    # Список существующих id ролей в БД группы зависимостей

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.create_admin()
        self.create_users(users=self.users)

    @staticmethod
    def create_admin() -> None:
        """Создание супер-юзера
        roles_id список id существующих ролей в БД группы зависимостей
        """
        try:
            if not User.objects.filter(username='radif'):
                roles_id = [r_id['id'] for r_id in
                            PermissionGroups.objects.all().values('id')]
                User.objects.create_superuser(
                    username='radif',
                    email='mail@radif.ru',
                    # Назначение админу первой роли в БД, а это Администратор
                    password='qwertytrewq').roles.add(roles_id[0] if roles_id
                                                      else None)
        except OperationalError or ProgrammingError as error:
            print(f'\n{error}\n')

    @staticmethod
    def create_users(users: list[dict]) -> None:
        """ Создание пользователей
        :param users: список словарей с данными пользователей
        roles_id список id существующих ролей в БД группы зависимостей
        """
        roles_id = [r_id['id'] for r_id in
                    PermissionGroups.objects.all().values('id')]
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
                        password=user['password']).roles.add(
                        random.choice(roles_id))
            except OperationalError or ProgrammingError as error:
                print(f'\n{error}\n')
