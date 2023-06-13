from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, exceptions
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Image
from .serializers import ImageModelSerializer, ImageModelSerializerPost, \
    ImageModelResizeSerializer, ImageModelUpdateSerializer


class ImageModelViewSet(ModelViewSet):
    """ Набор представлений для модели изображений """
    serializer_class = ImageModelSerializer
    queryset = Image.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        """ Возврат разных сериализаторов в зависимости от метода запроса """
        if self.request.method in ['PATCH' or 'PUT']:
            return ImageModelUpdateSerializer

        if self.request.method in ['POST']:
            if self.action == 'resize':
                # Сериализатор для изменения размера изображения
                return ImageModelResizeSerializer
            return ImageModelSerializerPost
        return ImageModelSerializer

    @swagger_auto_schema(request_body=ImageModelSerializer)
    @action(detail=True, methods=['POST'])
    def resize(self, request, pk=None):
        """ Изменение размера изображения """
        image = get_object_or_404(Image, pk=pk)
        serializer = ImageModelResizeSerializer(image, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.create(image=image, data=request.data)
            get_serializer = ImageModelSerializer(serializer.instance)
            return Response(get_serializer.data,
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=ImageModelSerializer)
    def create(self, request, *args, **kwargs):
        """ Добавление изображения """
        serializer = ImageModelSerializerPost(data=request.data)
        if serializer.is_valid():
            save_serializer = serializer.save()
            get_serializer = ImageModelSerializer(save_serializer)
            return Response(get_serializer.data,
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    # В Swagger отключаю отображение метода PUT, оставляю только PATCH
    @swagger_auto_schema(auto_schema=None)
    def update(self, request, *args, **kwargs):
        """ Отключаю метод PUT, оставляю только PATCH """
        partial = kwargs.get('partial', False)  # Должно быть .get() не .pop()
        if not partial:
            raise exceptions.MethodNotAllowed(request.method)

        if request.data.get('name', False) and request.data.__len__() == 1:
            return super().update(request, *args, **kwargs)
        else:
            return Response({'error': 'разрешено изменять только имя!'},
                            status=status.HTTP_400_BAD_REQUEST)
