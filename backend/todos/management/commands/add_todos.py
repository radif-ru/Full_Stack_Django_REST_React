import random

from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError, IntegrityError
# from django.db.models import Q

from scripts import load_from_json
from todos.models import Todo, Project
from users.models import User


class Command(BaseCommand):
    help = 'Создание заметок'
    todos = load_from_json('dumps_pycharm_export/main_todo_todo')

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.add_todos(self.todos)

    @staticmethod
    def add_todos(todos: list[dict]) -> None:
        """ Создание заметок
        :param todos: список заметок
        users_id - id всех пользователей.
        projects_id - id всех проектов.
        При создании заметок, в поле пользователя создавшего заметку
        и поле проект, к которому прикреплена заметка добавляются рандомные id
        из существующих полей в БД
        """
        try:
            todo_objs = Todo.objects
            # Создание списка из id всех пользователей в БД
            users_id = [u_id['id'] for u_id in User.objects.all().values('id')]
            # Создание списка из id всех проектов в БД
            projects_id = [
                proj_id['id'] for proj_id in Project.objects.all().values('id')
            ]
            for todo in todos:
                # Рандомный id пользователя из списка пользователей
                rand_u_id = random.choice(users_id)
                # Рандомный id проекта из списка проектов
                rand_proj_id = random.choice(projects_id)
                # if not todo_objs.filter(
                # Фильтрация AND, где одновременно выполняются 2 условия
                # Отключил так как теперь в файле уникальные тексты
                #     Q(text=todo['text']) & Q(user_id=todo['user_id'])):
                if not todo_objs.filter(text=todo['text']):
                    todo_objs.create(
                        user_id=rand_u_id, text=todo['text'],
                        project_id=rand_proj_id)
        except OperationalError or ProgrammingError as error:
            print(error)
        except IntegrityError as error:
            print(f'\nСочетание данного уникального текста и данного '
                  f'пользователя уже есть, пропускаю... {error}\n')
