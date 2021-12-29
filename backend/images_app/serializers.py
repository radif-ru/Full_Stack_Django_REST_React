import os
import uuid
from copy import copy
from io import BytesIO

import requests
from PIL import Image as PilImage
from requests.exceptions import SSLError
from rest_framework import serializers

from config.settings import MEDIA_ROOT, IMAGES_UPLOAD_DIRECTORY
from .models import Image


class ImageModelSerializer(serializers.ModelSerializer):
    """ Сериализация модели Изображений для метода Get """
    width = serializers.SerializerMethodField()
    height = serializers.SerializerMethodField()

    def get_width(self, obj):
        """ Получение ширины изображения """
        if obj.picture:
            return obj.picture.width

    def get_height(self, obj):
        """ Получение высоты изображения """
        if obj.picture:
            return obj.picture.height

    class Meta:
        model = Image
        fields = ('id', 'name', 'url', 'picture', 'width', 'height',
                  'parent_picture')


class ImageModelSerializerPost(serializers.ModelSerializer):
    """ Сериализация модели Изображений для метода Post """
    file = serializers.ImageField(source='picture', required=False)
    name = serializers.CharField(required=False, write_only=True)

    def create(self, *args, **kwargs):
        """ Обработка загружаемых файлов
        Сохранение файлов по url адресу.
        Присвоение имён.
        Новые пути для тех файлов, которые уже существуют.
        """
        image = super().create(*args, **kwargs)
        if image.url:
            if not image.name:
                image.name = image.url.split('/')[-1]
            picture_name = image.url.split('/')[-1]
            picture_url = f'{MEDIA_ROOT}/{IMAGES_UPLOAD_DIRECTORY}/' \
                          f'{picture_name}'
            while os.path.exists(picture_url):
                picture_name = f'{"".join(picture_name.split(".")[:-1])}_' \
                               f'{str(uuid.uuid4())[-7:]}' \
                               f'.{picture_name.split(".")[-1]}'
                picture_url = f'{MEDIA_ROOT}/{IMAGES_UPLOAD_DIRECTORY}/' \
                              f'{picture_name}'
            resp = requests.get(image.url)
            upload_image = PilImage.open(BytesIO(resp.content))
            upload_image.save(picture_url)
            image.picture = f'{IMAGES_UPLOAD_DIRECTORY}/{picture_name}'
        else:
            if not image.name:
                # Для Linux систем
                image.name = image.picture.path.split('/')[-1]
                # Для Windows (на продакшн можно удалить)
                image.name = image.name.split('\\')[-1]
        image.save()
        return image

    def validate(self, attrs):
        """ Валидация данных
        Проверка на ошибки от внешнего ресурса с файлом,
        корректность заполнения полей
        """
        if attrs.get('url'):
            try:
                response = requests.get(attrs['url'])
                status_code = response.status_code
                if status_code != requests.codes.ok:
                    raise serializers.ValidationError(
                        {'error': f'Код ошибки на стороне ресурса: '
                                  f'{status_code}'})
            except ConnectionError as error:
                raise serializers.ValidationError(
                    {'error': f'Ошибка соединения: {error}'})
            except SSLError as error:
                raise serializers.ValidationError(
                    {'error': f'Ошибка SSL соединения: {error}'})
            except Exception as error:
                raise serializers.ValidationError(
                    {'error': f'Ошибка: {error}'})
            content_type = response.headers['Content-Type']
            if content_type.split('/')[0] != 'image':
                raise serializers.ValidationError(
                    {'error': 'Ссылка указывает не на изображение'})
        if not attrs.get('picture') and not attrs.get('url'):
            raise serializers.ValidationError(
                {'error': 'Необходимо выбрать загружаемый файл или указать '
                          'url-адрес'})
        if attrs.get('picture') and attrs.get('url'):
            raise serializers.ValidationError(
                {'error': 'Загружать можно только из 1 источника'})
        return attrs

    class Meta:
        model = Image
        fields = ('file', 'url', 'name')


class ImageModelResizeSerializer(serializers.ModelSerializer):
    """ Создание нового изображения с изменённым разрешением """
    height = serializers.IntegerField(min_value=12, max_value=10240,
                                      required=False)
    width = serializers.IntegerField(min_value=12, max_value=10240,
                                     required=False)

    def create(self, *args, **kwargs):
        """ Обработка изображения, сохранение новых данных """
        image = kwargs['image']

        pil_image = PilImage.open(image.picture)
        height = int('height' in kwargs['data'] and kwargs['data'][
            'height'] or image.picture.height)
        width = int('width' in kwargs['data'] and kwargs['data'][
            'width'] or image.picture.width)

        resize_image = pil_image.resize((width, height))

        image_name = f'{image.name}_' \
                     f'{resize_image.width}_' \
                     f'{resize_image.height}'
        picture_name = f'{image_name}.{image.picture.path.split(".")[-1]}'
        picture_url = f'{MEDIA_ROOT}/{IMAGES_UPLOAD_DIRECTORY}/{picture_name}'
        resize_image.save(picture_url)

        image.name = image_name
        # Делаю копию текущего объекта в родительское поле, так как ниже
        # происходит замена первичного ключа
        image.parent_picture = copy(image)
        image.picture = f'{IMAGES_UPLOAD_DIRECTORY}/{picture_name}'

        image.url = None
        # None - для получения нового первичного ключа
        image.pk = None
        image.save()
        return image

    def validate(self, attrs):
        if 'height' not in attrs and 'width' not in attrs:
            raise serializers.ValidationError(
                {'error': 'Необходимо указать ширину или высоту'})
        return attrs

    class Meta:
        model = Image
        fields = ('height', 'width')
