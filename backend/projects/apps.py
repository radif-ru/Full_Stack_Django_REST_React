from django.apps import AppConfig


class ProjectsConfig(AppConfig):
    """Настройки приложения Projects"""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'projects'
    verbose_name = 'проекты'

    def ready(self):
        """Подключение обработчика сигналов для моделей"""
        import projects.signals.handlers  # handlers
