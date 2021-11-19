from django.apps import AppConfig


class TodosConfig(AppConfig):
    """Настройки приложения _TODO_"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'todos'
    verbose_name = 'заметки'
