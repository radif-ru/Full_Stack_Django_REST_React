from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, \
    TokenObtainPairView

from projects.views import ProjectModelViewSet
from todos.views import TodoModelViewSet
from users.views import UserModelViewSet

# Swagger - инструменты для реализации OpenAPI. Авто-генерация документации API
schema_view = get_schema_view(
    openapi.Info(
        title='Todos',
        default_version='1.0',
        description='Web-сервис для работы с TODO-заметками',
        contact=openapi.Contact(name='Radif',
                                url='radif.ru',
                                email='mail@radif.ru', ),
        license=openapi.License(name='MIT License'),
    ),
    public=True,
    permission_classes=(AllowAny,)
)

# Роутер для авто-создания набора url-адресов (связь с id, get, set и т.д.)
router = DefaultRouter()
router.register('users', UserModelViewSet)
router.register('projects', ProjectModelViewSet, basename='projects')
router.register('todos', TodoModelViewSet)

urlpatterns = [
    path('administration/', admin.site.urls),

    # Стандартный метод авторизации rest_framework
    path('api/auth/', include('rest_framework.urls')),
    # Стандартный метод токенизации rest_framework
    # path('api/token/', views.obtain_auth_token),

    # Аутентификация с помощью токенов JWT
    path('api/token/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    # Сброс/обновление токена JWT
    path('api/token/refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),

    # Router - маршрутизация url-адресов
    path('api/', include(router.urls)),

    # Swagger - Генерация документации API в HTML формате, в браузере
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui'),
    # ReDoc - другое использование и отображение созданной спецификации
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0),
         name='schema-redoc'),
    # Выдача документации в JSON или YAML формате
    re_path('^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),

    #######################

    # Система версий API:
    # Во views необходимо обрабатывать self.request.version

    # Включена система версий по заголовкам. По этому здесь не требуется
    # дополнительных манипуляций. Комменты ниже для примеров

    # Пример ручного, гибкого управления всеми версиями с помощью 1 регулярного
    # выражения. Для этого метода в setting включить URLPathVersioning
    # re_path(r'^api/(?P<version>\d\.\d)/projects/$',
    #         ProjectModelViewSet.as_view({'get': 'list', 'post': 'create'})),

    # Пример стандартизованного управления версиями
    # Для этого метода в setting включить NamespaceVersioning
    # path('api/projects/1.0/', include('projects.urls', namespace='1.0')),
    # path('api/projects/2.0/', include('projects.urls', namespace='2.0')),
]
