import asyncio
import aiohttp
import json
from contextvars import ContextVar

# Создание контекстной переменной для глобального доступа
TextsList = ContextVar('texts_list', default=[])


async def get_fish_text(num: int) -> None:
    """ Запрос и обработка Рыба-текста из 3 абзацев, полученного в json.
    Получение данных с помощью aiohttp и присвоение в контекстную переменную.
    """
    async with aiohttp.ClientSession() as session:
        async with session.get(
                'https://fish-text.ru/get?format=json&number=3') as resp:
            json_data = await resp.text()
            dict_data = json.loads(json_data)
            status = dict_data['status']
            text = dict_data['text']

            texts_list = TextsList.get()
            if status == 'success':
                texts_list.append({'id': num, 'text': text})
            else:
                texts_list.append({'id': num, 'text': f'Ошибка! {status}'})
            TextsList.set(texts_list)


async def main(quantity=33) -> None:
    """Создание асинхронных задач и обработка результатов выполнения"""
    await asyncio.gather(*(get_fish_text(num) for num in range(1, quantity)))


def get_fish_texts() -> list:
    """ Получить список из объектов с Рыба-текстами
    Обнуление данных в контекстной переменной.
    Асинхронное получение новых данных с помощью asyncio и aiohttp.
    Каждый раз возвращается новый список с новыми данными
    """
    texts_list = TextsList.get()
    texts_list.clear()

    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    event_loop.run_until_complete(main(33))

    texts_list = TextsList.get()
    return texts_list


if __name__ == '__main__':
    print(get_fish_texts())
