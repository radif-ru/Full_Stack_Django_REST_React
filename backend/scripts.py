import json
import os

from config.settings import JSON_PATH


def load_from_json(file_name: str) -> list:
    """Загружает данные из json файла, дампа таблицы, возвращает словарь
    :param file_name: имя файла без постфикса, расширения
    """
    with open(
            os.path.join(JSON_PATH, f'{file_name}.json'),
            encoding='utf-8'
    ) as infile:
        return json.load(infile)
