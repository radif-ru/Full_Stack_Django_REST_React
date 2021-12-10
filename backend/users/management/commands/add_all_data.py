import os

from django.core.management.base import BaseCommand

from users.management.commands.add_users import Command as AddUsers
from users.management.commands.add_roles import Command as AddRoles

from projects.management.commands.add_projects import Command as AddProjects
from todos.management.commands.add_todos import Command as AddTodos


class Command(BaseCommand):
    help = 'Сборка всех подготовленных данных'

    def handle(self, *args, **options):
        self.migrate()
        self.collect_static()

        AddRoles.add_groups(roles=AddRoles.roles)
        AddUsers.create_admin()
        AddUsers.create_users(users=AddUsers.users)

        AddProjects.add_projects(projects=AddProjects.projects)
        AddTodos.add_todos(todos=AddTodos.todos)

    @staticmethod
    def migrate():
        """Подготовка и выполнение миграций"""
        os.system('python manage.py makemigrations --noinput')
        os.system('python manage.py migrate --noinput')

    @staticmethod
    def collect_static():
        """Сборка стандартных и подготовленных статических файлов"""
        os.system('mkdir -p static')
        os.system('python manage.py collectstatic --no-input --clear')
