"""Схема GraphQL"""
import graphene
from django.db.models import Prefetch
from graphene_django import DjangoObjectType

from projects.models import Project
from todos.models import Todo
from users.models import User, PermissionGroups


class UserType(DjangoObjectType):
    """Тип GraphQL.
    Наследование от DjangoObjectType позволяет автоматически создать нужные
    типы полей для указанной модели и указать нужные поля.
    """

    class Meta:
        """Поле password не включено"""
        model = User
        exclude = ('password',)


class PermissionGroupsType(DjangoObjectType):
    class Meta:
        model = PermissionGroups
        fields = '__all__'


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = '__all__'


class Query(graphene.ObjectType):
    """Тип Query. При вложенных полях нужно обязательно указать их типы -
    как например это пришлось сделать для ролей
    """
    all_roles = graphene.List(PermissionGroupsType)
    all_users = graphene.List(UserType)
    all_projects = graphene.List(ProjectType)
    all_todos = graphene.List(TodoType)

    # Фильтрация. required, если True - обязательное поле
    user_by_id = graphene.Field(UserType, id=graphene.Int(required=True))
    todo_by_user_login = graphene.List(TodoType,
                                       login=graphene.String(),
                                       first_name=graphene.String(),
                                       last_name=graphene.String())

    def resolve_all_users(self, info):
        """Поле. Префикс resolve_ - обязателен. all_users - имя поля
        Возвращение только активных пользователей
        При вызове связанных полей так же только активные проекты и заметки
        """
        return User.objects.filter(is_active=1).prefetch_related(
            Prefetch(
                'user_todos',
                queryset=Todo.objects.filter(is_active=1)
            ),
            Prefetch(
                'user_projects',
                queryset=Project.objects.filter(is_active=1)
            ),
            'roles'
        )

    def resolve_all_projects(self, info):
        return Project.objects.prefetch_related(
            'users', 'users__roles').filter(is_active=1)

    def resolve_all_todos(self, info):
        return Todo.objects.prefetch_related(
            'project__users__roles', 'user__roles').filter(is_active=1)

    def resolve_user_by_id(self, info, id):
        """ Обработка переданного параметра - id
        Параметры передаются в скобках, через запятую, например:
        {userById (id: 22) {id username email}}
        """
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist as exception:
            raise User.DoesNotExist('Пользователь не найден')

    def resolve_todo_by_user_login(self, info, login=None, first_name=None,
                                   last_name=None):
        """Обработка переданных параметров - фильтрация на их основе"""
        todos = Todo.objects.all()
        if login:
            todos = todos.filter(user__username=login)
        if first_name:
            todos = todos.filter(user__first_name__contains=first_name)
        if last_name:
            todos = todos.filter(user__last_name__contains=last_name)
        return todos


class UserUpdateMutation(graphene.Mutation):
    """Изменение данных. Для примера, включено только 1 поле, кроме id"""

    class Arguments:
        birthdate = graphene.Date(required=False)
        id = graphene.ID()

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, birthdate, id):
        try:
            user = User.objects.get(id=id)
            user.birthdate = birthdate
            user.save()
            return UserUpdateMutation(user)
        except User.DoesNotExist as exception:
            raise User.DoesNotExist('Пользователь не найден')


class UserCreateMutation(graphene.Mutation):
    """Создание данных. Пример запроса (для других мутаций так же):
    mutation {
      createUser(login: "murrrrAt", email: "murrrr@inbox.com",
        password: "qwertytrewq", firstName: "Мурат"){
        user {
          id
          username
          email
          firstName
        }
      }
    }
    """

    class Arguments:
        email = graphene.String(required=True)
        birthdate = graphene.Date(required=False)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        login = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, *args, **kwargs):
        """ Поля добавляю сразу, как вытащу login, так как в модели это
        username. Далее хэширую пароль в объекте и сохраняю данные в БД.
        """
        username = kwargs.pop('login')
        user = User(*args, **kwargs)
        user.username = username
        password = user.password
        user.set_password(password)
        user.save()
        return UserCreateMutation(user)


class Mutation(graphene.ObjectType):
    update_user = UserUpdateMutation.Field()
    create_user = UserCreateMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
