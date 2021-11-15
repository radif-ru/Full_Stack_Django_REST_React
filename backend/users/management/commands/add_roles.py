from django.core.management.base import BaseCommand
from django.db import OperationalError, ProgrammingError

from config.settings import Roles
from users.models import PermissionGroups


class Command(BaseCommand):
    help = 'Создание групп разрешений'
    roles = Roles

    def handle(self, *args, **options):
        """Команды на выполнение"""
        self.add_groups(self.roles)

    @staticmethod
    def add_groups(roles: iter):
        try:
            permission_groups_objs = PermissionGroups.objects
            for role in roles:
                if not permission_groups_objs.filter(role=role):
                    permission_groups_objs.create(role=role)
        except OperationalError or ProgrammingError as error:
            print(error)
