from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, \
    TokenObtainPairView

from projects.views import ProjectModelViewSet
from todos.views import TodoModelViewSet
from users.views import UserModelViewSet

# Роутер для авто-создания набора url-адресов (связь с id, get, set и т.д.)
router = DefaultRouter()
router.register('users', UserModelViewSet)
router.register('projects', ProjectModelViewSet, basename='projects')
router.register('todos', TodoModelViewSet)

urlpatterns = [
    path('administration/', admin.site.urls),

    #######################

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

    #######################

    # Система версий API:
    # Во views необходимо обрабатывать self.request.version

    # Включена система версий по заголовкам. По этому здесь не требуется
    # дополнительных манипуляций. Комменты ниже для примеров

    # Пример ручного, гибкого управления версиями с помощью регулярного
    # выражения. Для этого метода в setting включить URLPathVersioning
    # re_path(r'^api/(?P<version>\d\.\d)/projects/$',
    #         ProjectModelViewSet.as_view({'get': 'list', 'post': 'create'})),

    # Пример стандартизованного управления версиями
    # Для этого метода в setting включить NamespaceVersioning
    # path('api/projects/1.0/', include('projects.urls', namespace='1.0')),
    # path('api/projects/2.0/', include('projects.urls', namespace='2.0')),

    #######################

    # Router
    path('api/', include(router.urls)),
]
