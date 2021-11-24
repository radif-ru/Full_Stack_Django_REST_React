import graphene
from graphene_django import DjangoObjectType

from projects.models import Project
from todos.models import Todo
from users.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
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
        return User.objects.all()

    def resolve_all_projects(self, info):
        return Project.objects.all()

    def resolve_all_todos(self, info):
        return Todo.objects.all()

    # Обработка фильтрации
    def resolve_user_by_id(self, info, id):
        return User.objects.get(id=id)

    def resolve_todo_by_user_login(self, info, login=None, first_name=None,
                                   last_name=None):
        todos = Todo.objects.all()
        if login:
            todos = todos.filter(user__username=login)
        if first_name:
            todos = todos.filter(user__first_name__contains=first_name)
        if last_name:
            todos = todos.filter(user__last_name__contains=last_name)
        return todos


# Изменение данных
class UserUpdateMutation(graphene.Mutation):
    class Arguments:
        birthdate = graphene.Date(required=True)
        id = graphene.ID()

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, birthdate, id):
        user = User.objects.get(id=id)
        user.birthdate = birthdate
        user.save()
        return UserUpdateMutation(user)


# Создание данных
class UserCreateMutation(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        birthdate = graphene.Date(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        login = graphene.String(required=True)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, birthdate, first_name, last_name, email,
               login):
        user = User(first_name=first_name, last_name=last_name,
                    birthdate=birthdate, email=email, username=login)
        user.save()
        return UserCreateMutation(user)


class Mutation(graphene.ObjectType):
    update_user = UserUpdateMutation.Field()
    create_user = UserCreateMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
