from django.apps import AppConfig


class ImagesAppConfig(AppConfig):
    """ Настройки приложения Изображения """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'images_app'
    verbose_name = 'работа с изображениями'

    def ready(self):
        """ Подключение обработчиков сигналов для моделей """
        import images_app.signals.handlers
