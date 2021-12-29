from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, \
    CreateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .models import Image
from .serializers import ImageModelSerializer, ImageModelSerializerPost, \
    ImageModelResizeSerializer


class ImageModelViewSet(ListModelMixin, RetrieveModelMixin, CreateModelMixin,
                        DestroyModelMixin, GenericViewSet):
    """ Набор представлений для модели изображений """
    serializer_class = ImageModelSerializer
    queryset = Image.objects.all()

    def get_serializer_class(self):
        """ Добавление изображения """
        if self.request.method in ['POST']:
            return ImageModelSerializerPost
        return ImageModelSerializer

    @action(detail=True, methods=['POST'])
    def resize(self, request, pk=None):
        """ Изменение размера изображения """
        image = get_object_or_404(Image, pk=pk)
        serializer = ImageModelResizeSerializer(image, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.create(image=image, data=request.data)
        return Response(status=status.HTTP_201_CREATED)
