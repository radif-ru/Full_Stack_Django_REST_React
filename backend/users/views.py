from djangorestframework_camel_case.render import CamelCaseJSONRenderer, \
    CamelCaseBrowsableAPIRenderer
from rest_framework.renderers import AdminRenderer, JSONRenderer, \
    BrowsableAPIRenderer, TemplateHTMLRenderer, StaticHTMLRenderer
from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserModelSerializer


class UserModelViewSet(ModelViewSet):
    """Набор представлений для модели Пользователь"""
    renderer_classes = (
        # Верблюжий стиль JSON и API, и стиль удобного администрирования
        CamelCaseJSONRenderer, CamelCaseBrowsableAPIRenderer, AdminRenderer
    )
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
