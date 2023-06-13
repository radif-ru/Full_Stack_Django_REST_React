import json

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, \
    APIClient, APITestCase, APISimpleTestCase

from mixer.auto import mixer
from rest_framework_simplejwt.views import TokenObtainPairView

from projects.models import Project
from todos.models import Todo
from users.views import UserModelViewSet
from users.models import User, PermissionGroups


class TestAuthorViewSetAPITestCase(APITestCase):
    def setUp(self) -> None:
        self.token_endpoint = '/api/token/'
        self.token_prefix = 'Bear R@d1f'

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
            'email': 'pushka@kolotushka.local',
        }
        self.user_data_2 = {
            'last_name': 'Петров',
            'first_name': 'Савелий',
            'middle_name': 'Инокентеевич',
            'password': self.password,
            'username': 'petro',
            'email': 'petro@local.ru',
        }

    def test_get_detail(self):
        """Пример использования миксера
        Миксер генерит связанные объекты, любой иерархии с заполненными данными
        Можно назначить данные по умолчанию, в том числе для вложенных объектов
        Пример того, что имена полей в верблюжьем стили из-за настроек рендера
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

        response_todo = json.loads(response.content)
        print(response_todo)
        # Здесь имена полей в верблюжьем стили из-за настроек рендера
        self.assertEqual(response_todo['user']['firstName'], 'Юра')
        self.assertEqual(response_todo['project']['name'], 'ВДВ')

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
        Проверка действительно ли поле создалось правильно.
        После разлогинивания так же можно создать аккаунт.
        """
        admin = User.objects.create_superuser(
            'admin', 'admin@admin.ru', self.password)
        self.client.login(username=admin.username, password=admin.password)
        role = mixer.blend(PermissionGroups)
        response = self.client.post(f'{self.users_endpoint}',
                                    {**self.user_data_2,
                                     'roles': [role.id]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data.get('middle_name'), 'Инокентеевич')

        self.client.logout()
        response = self.client.post(f'{self.users_endpoint}',
                                    {**self.user_data,
                                     'roles': [role.id]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.client.logout()

    def test_edit_admin(self):
        """Тестирование PUT запроса - изменение данных"""
        user = User.objects.create(**self.user_data)
        admin = User.objects.create_superuser('admin', 'admin@admin.ru',
                                              self.password)
        self.client.login(username=admin.username, password=self.password)
        role = mixer.blend(PermissionGroups)
        response = self.client.put(f'{self.users_endpoint}{user.id}/',
                                   {**self.user_data,
                                    'last_name': 'Ковальский',
                                    'middle_name': 'Фараонович',
                                    'roles': [role.id]
                                    })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(id=user.id)
        self.assertEqual(user.last_name, 'Ковальский')
        self.assertEqual(user.middle_name, 'Фараонович')
        self.client.logout()

    def test_edit_project(self):
        user = User.objects.create(username='ququ',
                                   email='quqarequ@ququ.qu',
                                   password=self.password
                                   )
        admin = User.objects.create_superuser('adme', 'adme@admin.com',
                                              self.password)
        self.client.login(username=admin.username, password=self.password)

        user = mixer.blend(User)
        response = self.client.post(f'{self.projects_endpoint}',
                                    {'name': 'Пиковая дама',
                                     'users': [user.id]})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        project = Project.objects.first()
        response = self.client.put(f'{self.projects_endpoint}{project.id}/',
                                   {'name': 'Руслан и Людмила',
                                    'users': [user.id]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        project = Project.objects.first()
        self.assertEqual(project.name, 'Руслан и Людмила')


class TestAuthorViewSetTestCase(TestCase):
    def setUp(self) -> None:
        self.token_endpoint = '/api/token/'
        self.token_prefix = 'Bear R@d1f'

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

    def test_create_admin(self):
        """Создание и авторизация админа.
        Получение и передача токена в force_authenticate для авторизации.
        Создание пользователя админом.
        """
        admin = User.objects.create_superuser(
            'admin', 'admin@admin.ru', self.password)
        view_token = TokenObtainPairView.as_view()
        token_request = self.factory.post(f'{self.token_endpoint}', {
            'username': admin.username,
            'password': self.password
        })
        response_token = view_token(token_request)
        print(f'{self.token_prefix} {response_token.data["access"]}')
        force_authenticate(
            token_request, admin, f'{self.token_prefix} '
                                  f'{response_token.data["access"]}')
        self.assertEqual(response_token.status_code, status.HTTP_200_OK)

        role = mixer.blend(PermissionGroups)
        request = self.factory.post(f'{self.users_endpoint}',
                                    {**self.user_data_2,
                                     'roles': [role.id]})
        view = UserModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_list(self):
        factory = APIRequestFactory()
        request = factory.get(self.users_endpoint)
        view = UserModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        """Создание пользователя"""
        role = mixer.blend(PermissionGroups)
        request = self.factory.post(self.users_endpoint, {**self.user_data,
                                                          'roles': [role.id]},
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


class TestMath(APISimpleTestCase):
    """Не использует БД, быстро исполняется.
    Применяется, например для тестов внутренних функций.
    """

    def test_sqrt(self):
        import math
        self.assertEqual(math.sqrt(144), 12)
