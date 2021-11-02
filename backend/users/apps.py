from django.apps import AppConfig


class AuthorsConfig(AppConfig):
    """Настройки приложения Пользователи"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
