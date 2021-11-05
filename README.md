# Django REST framework. Проект «Web-сервис для работы с TODO-заметками».

## Стек технологий

### Python 3.10
> `django` - Django framework
> 
> `djangorestframework` - Django REST framework
> 
> `markdown` - язык разметки
> 
> `django-filter` - фильтрация запросов
> 
> `django-cors-headers` - Настройка политики CORS. Работа с заголовками для доступа React к Django
> 
> `djangorestframework-camel-case` - Визуализация в верблюжий стиль для отображения JSON и браузерного API. И наоборот в змеиный стиль для питона

### JavaScript, Node.js
> `npx` - режим одноразового запуска, пакет для запуска пакетов без установки в систему.
> 
> `create-react-app` создание/установка проекта на `React` + `Babel`, `Webpack` и другие полезные зависимости для комфортной работы
> 
> `axios` - библиотека для браузеров и Node.js, HTTP-клиент

## Web-ресурсы

>`/admin/` - админка

## Методы API проекта, Endpoint-ы 

>`/api/auth/login/` - Авторизация пользователя

>`/api/auth/logout/` - Деавторизация пользователя

>`/api/users/` - GET, POST, HEAD, OPTIONS - в зависимости от метода запроса - вывод всех пользователей, создание пользователя и т.д.

>`/api/users/<int:pk>` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - в зависимости от метода запроса - вывод пользователя по id, редактирование, удаление и т.д.

>`/api/projects/` - GET, POST, HEAD, OPTIONS - список проектов, создание проекта

>`/api/projects/<int:pk>` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - вывод, редактирование, удаление проекта

>`/api/todos/` - GET, POST, HEAD, OPTIONS - список заметок, создание заметки

>`/api/todos/<int:pk>` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - вывод, редактирование, удаление заметки

## Консольные команды в рамках проекта для запуска моих скриптов:

>`python manage.py add_users` - создание админа и пользователей

## Полезные команды:

### Консольные команды (Python, Django, DRF)

>`python venv env` - создание виртуального окружения

>`pip install django djangorestframework markdown django-filter` - установка зависимостей, полезных библиотек

>`pip freeze > requirements.txt` - помещаем все зависимости проекта в файл `requirements.txt`

>`pip install -r requirements.txt` - устанавливаем все зависимости проекта из файла `requirements.txt`

>`pip list` - удобное отображение всех установленных приложений, библиотек

>`django-admin startproject config` - создание проекта 'config'

>`python manage.py startapp users` - создание приложения 'Пользователи'

>`python manage.py makemigrations` - создание миграций, необходимо после создания/обновления моделей

>`python manage.py migrate` - выполнение миграций

>`python manage.py sqlmigrate <app_name>` - выполняется после создания миграций. Позволяет вывести на экран SQL-запросы, которые будут генерироваться для Django командой применения миграций к базе данных (то есть к таблицам, соответствующим указанному приложению)

>`python manage.py collectstatic` - сборка стандартных и подготовленных статических файлов

>`python manage.py createsuperuser` - создание супер-пользователя

>`python manage.py runserver 0.0.0.0:3333` - запуск проекта на порту 3333 (доступ http://localhost:3333)

### Консольные команды (JavaScript, NodeJS, npx, React)

>`npx create-react-app frontend` - создание/установка проекта на React + Babel, webpack и другие полезные зависимости для комфортной работы, `npx` - режим одноразового запуска, пакет для запуска пакетов без установки в систему.

>`npm run start` - запуск фронтенд проекта, выполнять в корне фронта (в данном случае в каталоге frontend)



### Консольные команды для Docker-compose: 

> `docker-compose build` - Создать образ

> `docker-compose -f docker-compose.prod.yml build` - Создать образ (запуск из файла `docker-compose.prod.yml`). Префикс `-f` `имя_файла`, после `docker-compose` позволяет запускаться из файла с нестандартным именем для выполнения любых возможных команд

> `docker-compose up` - Запустить контейнер

> `docker-compose up -d --build` - Создать образ и запустить контейнер в фоне

> `docker image ls -a && docker container ls -a && docker volume ls` - Посмотреть все образы/контейнеры/тома

> `docker container prune && docker image prune && docker volume prune` - Удалить неиспользуемые контейнеры/образы/тома

> `docker-compose down -v` - Удалить тома вместе с контейнерами 

> `docker-compose -f docker-compose.prod.yml down -v` - Удалить тома вместе с контейнерами (запуск из файла docker-compose.prod.yml)

> `docker-compose logs -f` - Проверка наличия ошибок в журналах, просмотр логов

> `docker exec -it CONTAINER ID bash` - Зайти в работающий контейнер 

> `docker volume inspect django-on-docker_postgres_data` - Проверить, что том (volume) был создан

> `docker rmi CONTAINER ID`, `docker rmi -f CONTAINER ID` - Удалить образ 

> `docker image rm name_or_id`, `docker container rm name_or_id`, `docker volume rm name_or_id` - Удалить образы, контейнеры, тома по названию или id

> `docker stop CONTAINER ID` - Приостановить контейнер 

> `docker start CONTAINER ID` - Запустить ранее остановленный контейнер 

> `docker restart CONTAINER ID` - Перегрузить контейнер 

> `docker ps`, `docker ps -a` - Посмотреть работающие и все контейнеры 

> `docker images` - Посмотреть список всех образов


#### Работа с django, manage.py (сервис web):

> `docker-compose exec web python manage.py flush --no-input ` - Очистка таблиц

> `docker-compose exec web python manage.py makemigrations --no-input` - Создание миграций

> `docker-compose exec web python manage.py migrate` - Запуск миграций

> `docker-compose exec web python manage.py collectstatic --no-input --clear` - Сборка стандартных и подготовленных статических файлов 


#### Вход в postgres (сервис db): 
> `docker-compose exec db psql --username=admin --dbname=db_name` - вход в сервис `db`, а внутри него вход в postgres, имя `admin`, бд `db_name`
##### Внутри postgres: 
> ` # \l ` - Показать базы данных

> ` # \c db_name ` - Подключение к базе данных `db_name`

> ` # \dt ` - Список зависимостей

> ` # \q ` - Выход из postgres
