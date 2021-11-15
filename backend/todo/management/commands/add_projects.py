from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from scripts import load_from_json
from todo.models import Project
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
        users_id - id всех пользователей. При создании проектов, в поле
        пользователей работающих с каждым проектом добавляются все пользователи
        """
        try:
            project_objs = Project.objects
            users_id = [u_id['id'] for u_id in User.objects.all().values('id')]
            for project in projects:
                if not project_objs.filter(name=project['name']):
                    project_objs.create(
                        name=project['name'],
                        repository=project['repository']).users.add(*users_id)
        except OperationalError or ProgrammingError as error:
            print(error)
