from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from graphene_django.views import GraphQLView
from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, \
    TokenObtainPairView

from config.settings import DEBUG
from projects.views import ProjectModelViewSet
from todos.views import TodoModelViewSet
from users.views import UserModelViewSet, PermissionGroupsModelViewSet

# Swagger - инструменты для реализации OpenAPI. Авто-генерация документации API
schema_view = get_schema_view(
    openapi.Info(
        title='Todos',
        default_version='1.0',
        description='Web-сервис для работы с TODO-заметками',
        contact=openapi.Contact(name='Radif',
                                url='https://radif.ru',
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
router.register('roles', PermissionGroupsModelViewSet)

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

    # GraphQL. При установке graphiql=True, включается интерактивный режим
    # для отладки, в релизе следует отключить. Настроил соответственно:
    # csrf_exempt - отключает проверку CSRF-токена для данного адреса
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))) if DEBUG
    else path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=False))),

    # Пути для запуска фронтенда на Django
    re_path('^(''|todos|users|users?/\d|projects|projects?/\d)$',
            TemplateView.as_view(template_name='index.html')),

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
