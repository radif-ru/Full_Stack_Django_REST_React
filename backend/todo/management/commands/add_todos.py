from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError
from django.db.models import Q

from scripts import load_from_json
from todo.models import Todo


class Command(BaseCommand):
    help = 'Создание заметок'
    todos = load_from_json('dumps_pycharm_export/main_todo_todo')

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.add_todos(self.todos)

    @staticmethod
    def add_todos(todos: list[dict]):
        try:
            todo_objs = Todo.objects
            for todo in todos:
                if not todo_objs.filter(
                        Q(text=todo['text']) & Q(user_id=todo['user_id'])):
                    todo_objs.create(
                        user_id=todo['user_id'], text=todo['text'],
                        project_id=todo['project_id'])
        except OperationalError or ProgrammingError as error:
            print(error)
