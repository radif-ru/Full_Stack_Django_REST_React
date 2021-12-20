import asyncio
import json
from requests import request
from contextvars import ContextVar

# Создание контекстной переменной для глобального доступа
Texts = ContextVar('texts', default=[])


# def callback(result):
#     """Обработка результата выполнения задачи"""
#     text = result.result()
#     print(text)


async def get_fish_text(num):
    """Запрос на получение Рыба-текста из 3 абзацев в формате json"""
    resp = request('get', 'https://fish-text.ru/get?format=json&number=3')
    json_data = resp.content.decode('unicode-escape')
    dict_data = json.loads(json_data)
    status = dict_data['status']
    text = dict_data['text']

    texts = Texts.get()
    if status == 'success':
        # return {num: text}
        texts.append({num: text})
    else:
        # return {num: f'Ошибка! {status}'}
        texts.append({num: text})
    Texts.set(texts)


async def main():
    """Создание асинхронных задач и обработка результатов выполнения"""
    # for num in range(1, 11):
    #     task = event_loop.create_task(get_fish_text(num))
    #     task.add_done_callback(callback)

    await asyncio.gather(*(get_fish_text(num) for num in range(1, 11)))
    # tasks.add_done_callback(callback)

    texts = Texts.get()
    print(texts)


# event_loop = asyncio.get_event_loop()
# event_loop.run_until_complete(main())
# event_loop.run_forever()
asyncio.run(main())
