from django.test import TestCase
from mixer.auto import mixer
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, \
    APIClient, APITestCase

from django.contrib.auth.models import User

from projects.models import Project
from todos.models import Todo
from .views import UserModelViewSet
from .models import User


class TestAuthorViewSetAPITestCase(APITestCase):
    """Отличается от класса ниже только встроенным APIClient
    Можно зажать ctrl и кликнуть APITestCase, в исходниках всё видно
    """

    def setUp(self) -> None:
        self.users_endpoint = '/api/users/'
        self.projects_endpoint = '/api/projects/'
        self.todos_endpoint = '/api/todos/'
        self.password = 'qwertytrewq'
        self.user_data = {
            'last_name': 'Пушкин',
            'first_name': 'Пушка',
            'middle_name': 'Пушкович',
            'password': self.password,
            'username': 'pushka',
            'email': 'pushka@kolotushka.local'
        }
        self.user_data_2 = {
            'last_name': 'Петров',
            'first_name': 'Савелий',
            'middle_name': 'Инокентеевич',
            'password': self.password,
            'username': 'petro',
            'email': 'petro@local.ru'
        }

    def test_get_detail(self):
        """Пример использования миксера
        Который генерит пользователя со случайными данными
        Миксер генерит связанные объекты, любой иерархии с заполненными данными
        Можно назначить данные по умолчанию, в том числе для вложенных объектов
        """
        user = mixer.blend(User)
        client = APIClient()
        response = client.get(f'{self.users_endpoint}{user.id}/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        user = mixer.blend(User, username='pushka')
        response = client.get(f'{self.users_endpoint}{user.id}/')
        print(response.data)
        self.assertEqual(response.data.get('username'), 'pushka')

        project = mixer.blend(Project)
        response = client.get(f'{self.projects_endpoint}{project.id}/')
        print(response.data)
        print(response.data.get('repository'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        todo = mixer.blend(Todo, user__first_name='Юра', project__name='ВДВ')
        response = client.get(f'{self.todos_endpoint}{todo.id}/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get(f'{self.users_endpoint}{todo.user.pk}/')
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get(
            f'{self.projects_endpoint}{todo.project.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)

    def test_post_admin(self):
        """Создание админа.
        Затем админом создаётся пользователь.
        Проверка действительно ли отчество создалось правильно.
        После разлогинивания так же можно создать аккаунт
        """
        admin = User.objects.create_superuser(
            'admin', 'admin@admin.ru', self.password)
        self.client.login(username=admin.username, password=admin.password)
        response = self.client.post(f'{self.users_endpoint}',
                                    self.user_data_2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get('middle_name'), 'Инокентеевич')

        self.client.logout()
        response = self.client.post(f'{self.users_endpoint}',
                                    self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TestAuthorViewSetTestCase(TestCase):
    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.api_client = APIClient()
        self.users_endpoint = '/api/users/'
        self.password = 'qwertytrewq'
        self.user_data = {
            'last_name': 'Пушкин',
            'first_name': 'Пушка',
            'middle_name': 'Пушкович',
            'password': self.password,
            'username': 'pushka',
            'email': 'pushka@kolotushka.local'
        }
        self.user_data_2 = {
            'last_name': 'Петров',
            'first_name': 'Савелий',
            'middle_name': 'Инокентеевич',
            'password': self.password,
            'username': 'petro',
            'email': 'petro@local.ru'
        }

    def test_get_list(self):
        factory = APIRequestFactory()
        request = factory.get(self.users_endpoint)
        view = UserModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        """Создание пользователя"""
        request = self.factory.post(self.users_endpoint, self.user_data,
                                    format='json')
        view = UserModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_young_birthdate(self):
        """Создание пользователя с возрастом меньше 18 лет - ловля ошибки"""
        request = self.factory.post(self.users_endpoint, {
            **self.user_data,
            'birthdate': '2009-06-06'
        }, format='json')
        view = UserModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_detail(self):
        """APIClient - упрощение тестирования, работа с API приложения"""
        user = User.objects.create(**self.user_data_2)
        client = APIClient()
        response = client.get(f'{self.users_endpoint}{user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_admin(self):
        """Создание и авторизация админа.
        Нужно получить и передать токен в force_authenticate
        """
        request = self.factory.post(f'{self.users_endpoint}', self.user_data_2)
        view = UserModelViewSet.as_view({'post': 'create'})
        admin = User.objects.create_superuser(
            'admin', 'admin@admin.ru', self.password)
        force_authenticate(request, admin)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
