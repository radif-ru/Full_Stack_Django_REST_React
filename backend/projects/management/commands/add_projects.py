import random

from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from scripts import load_from_json
from projects.models import Project
from users.models import User


class Command(BaseCommand):
    help = 'Создание проектов'
    projects = load_from_json('dumps_pycharm_export/main_todo_project')

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.add_projects(self.projects)

    @staticmethod
    def add_projects(projects: list[dict]):
        """ Создание проектов
        :param projects: список проектов
        users_id - id всех пользователей. При создании проектов, в поле
        пользователей работающих с каждым проектом добавляются рандомные
        пользователи, полученные из БД
        """
        try:
            project_objs = Project.objects
            # Создание списка из id всех пользователей в БД
            users_id = [u_id['id'] for u_id in User.objects.all().values('id')]
            # Количество пользователей в БД
            quantity_users = len(users_id)
            for project in projects:
                # Уникальное множество id из всех пользователей
                rand_users_id = {*random.choices(users_id, k=quantity_users)}
                if not project_objs.exists(name=project['name']):
                    project_objs.create(
                        name=project['name'],
                        repository=project['repository']).users.add(
                        *rand_users_id)
        except OperationalError or ProgrammingError as error:
            print(f'\n{error}\n')
