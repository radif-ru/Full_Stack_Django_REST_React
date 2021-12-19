import asyncio
import json

from requests import request


def callback(result):
    """Обработка результата выполнения задачи"""
    print(result.result())


async def get_fish_text(num):
    """Запрос на получение Рыба-текста из 3 абзацев в формате json"""
    resp = request('get', 'https://fish-text.ru/get?format=json&number=3')
    json_data = resp.content.decode('unicode-escape')
    dict_data = json.loads(json_data)
    status = dict_data['status']
    text = dict_data['text']

    if status == 'success':
        return {num: text}
    else:
        return {num: f'Ошибка! {status}'}


async def main():
    """Создание асинхронных задач и обработка результатов выполнения"""
    for num in range(1, 11):
        task = event_loop.create_task(get_fish_text(num))
        task.add_done_callback(callback)


event_loop = asyncio.get_event_loop()
event_loop.run_until_complete(main())
event_loop.run_forever()
