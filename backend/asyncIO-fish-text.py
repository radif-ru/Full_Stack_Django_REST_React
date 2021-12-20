import asyncio
import json
from contextvars import ContextVar
import aiohttp

# Создание контекстной переменной для глобального доступа
Texts = ContextVar('texts', default=[])


async def get_fish_text(num):
    """Запрос на получение Рыба-текста из 3 абзацев в формате json"""
    async with aiohttp.ClientSession() as session:
        async with session.get(
                'https://fish-text.ru/get?format=json&number=3') as resp:
            json_data = await resp.text()
            dict_data = json.loads(json_data)
            status = dict_data['status']
            text = dict_data['text']

            texts = Texts.get()
            if status == 'success':
                texts.append({num: text})
            else:
                texts.append({num: text})
            Texts.set(texts)


async def main():
    """Создание асинхронных задач и обработка результатов выполнения"""
    await asyncio.gather(*(get_fish_text(num) for num in range(1, 11)))


event_loop = asyncio.get_event_loop()
event_loop.run_until_complete(main())
# event_loop.run_forever()

# asyncio.run(main())


def get_fish_texts():
    texts = Texts.get()
    return texts


if __name__ == '__main__':
    print(get_fish_texts())
