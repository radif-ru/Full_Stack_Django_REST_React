# Django REST framework. Проект «Web-сервис для работы с TODO-заметками».

## Стек технологий

### Библиотеки на основе Python 3.10

> `django` (v. 3.2.9) - Django framework
> 
> `djangorestframework` (v. 3.12.4) - Django REST framework
> 
> `markdown` (v. 3.3.4) - Язык разметки
> 
> `django-filter` (v. 21.1) - Библиотека для фильтрации запросов + визуализация в браузерном API
> 
> `django-cors-headers` (v. 3.10.0) - Настройка политики CORS. Работа с заголовками для доступа React к Django
> 
> `djangorestframework-camel-case` (v. 1.2.0) - Визуализация в верблюжий стиль для отображения JSON и браузерного API. И наоборот в змеиный стиль для питона
>
> `djangorestframework-simplejwt` (v. 5.0.0), в него входит пакет `PyJWT` (v. 2.3.0) - Библиотека `JSON Web Token`. Современное средство передачи данных для аутентификации в клиент-серверных приложениях, посредством `JSON`. Токены создаются сервером, подписываются секретным ключом и передаются клиенту, который в дальнейшем использует данный токен для подтверждения своей личности.

### Библиотеки на основе JavaScript, Node.js и др.

> `npx` - Режим одноразового запуска, пакет для запуска пакетов без установки в систему.
> 
> `create-react-app` Создание/установка проекта на `React` (v. 17.0.2) + `Babel`, `Webpack` и другие полезные зависимости для комфортной работы.
> 
> `axios` (v. 0.24.0)  - Библиотека для браузеров и Node.js, HTTP-клиент.
> 
> `react-router-dom` (v. 6.0.2) - Маршрутизация `<BrowserRouter>`, `<HashRouter>` и другие компоненты.
> 
> `dateformat` (v. 5.0.2) - Преобразование даты.
> 
> `universal-cookie` (v. 4.0.4) - Универсальные `Cookies` для `React` и не только. Удобство использования.
>
> `bootstrap` (v. 5.1.3) - Библиотека `Bootstrap 5` - `HTML`, `CSS`-шаблоны, `JavaScript`-расширения. Содержит `@popperjs/core` (v. 2.10.2) - зависимость, механизм подсказок и всплывающих окон, подгружается через `node_modules/bootstrap/dist/js/bootstrap.bundle.min.js`. Так же содержит другие зависимости, которые отображены в корне `bootstrap`, файле `package.json`.
>
> `SASS` - Метаязык на основе CSS, предназначенный для увеличения уровня абстракции CSS-кода и упрощения файлов каскадных таблиц стилей. Используются фишки препроцессора: переменные, расширения, примеси, функции для стилей и т.д.

## Frontend. SPA. Точка входа http://localhost:3000/.

> `/` - Single Page Application - Вход в приложение, подгрузка данных из backend-а, дальше перемещение по всем компонентам с помощью меню, без перезагрузки страницы
>
> `/users/` - Подгрузка компонента Пользователи, данные всех пользователей в табличном виде с возможностью перехода на конкретного пользователя, отображение дней рождения переформатировано
>
> `/users/:id/` - Все данные пользователя по `:id` из БД на backend-е
> 
> `/projects/` - Подгрузка компонента Проекты, данные всех проектов в табличном виде, возможность перехода к конкретному проекту или к пользователям работающими с конкретным проектом
> 
> `/projects/:id/` - Данные Проекта по `:id` из БД на backend-е. + Отображаются имена/ссылки всех пользователей, кто работают с проектом. + Отображаются все заметки оставленные к проекту с данными чья это заметка и переформатированными датами создания/обновления. Данные собираются и фильтруются из разных источников, собранных в SPA, но без повторных запросов к БД!
> 
> `/todos/` - Подгрузка компонента Заметки, данные всех заметок в табличном виде, возможность перехода к проекту, к которому оставлены конкретные заметки
>
> `/login/` - Компонент с формой, где происходит авторизация на стороне клиента. От сервера в ответ приходит токен `JWT` и сохраняется в `Cookies`, соответственно даже после перезагрузки приложения или браузера пользователь остаётся авторизованные пока не разлогинится или не истечёт срок действия токена. При любых последующих запросах токен, взятый из `Cookies`, прикладывается с префиксом `Bear` для `JWT` и другими данными к заголовкам. Пока пользователь залогинин в меню отображается логин пользователя с кнопкой 'Выйти' - то есть деавторизации
> 
> `/logout/` - Деавторизация на стороне клиента. Происходит разлогинивание, из `Cookies` удаляется токен и логин

## Backend. Точка входа http://localhost:3333/. Web-ресурсы

> `/administration/` - Админка

## Backend. Точка входа http://localhost:3333/. Методы API проекта, Endpoint-ы 

### Браузерная авторизация. Настроено для работы только в режиме DEBUG!

> `/api/auth/login/` - Авторизация пользователя
>
> `/api/auth/logout/` - Деавторизация пользователя

### Авторизация с помощью JWT - JSON Web Token

> `/api/token/` - Получение Токена через POST запрос для авторизации
> 
> `/api/token/refresh/` - Сброс / обновление токена

### Пользователи

#### Система прав: 
> 1. Администраторы (Джанговские и из моих групп зависимостей) могут всё 
> 2. Изменять данные может владелец данного аккаунта. 
> 3. Удалить аккаунт может владелец данного аккаунта. 
> 4. Создать аккаунт может любой, даже не авторизованный пользователь 
> 5. Читать данные могут все. Но не все данные включены в сериализаторе

> `/api/users/` - GET, POST, HEAD, OPTIONS - Вывод данных всех пользователей. Регистрация. В сериализаторе включена фильтрация по возрасту. Если меньше 18 лет, зарегистрироваться не получится. Пароль ввести/обновить можно, но прочитать нельзя. 

> `/api/users/<int:pk>/` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - В зависимости от метода запроса - вывод данных, редактирование и т.д. пользователя по `id` в БД, вместо `<int:pk>` подставить id Пользователя.

#### Extra Actions:

> `/api/users/<int:pk>/login/` - GET, HEAD, OPTIONS - Вывод уникального логина пользователя по id в БД, вместо `<int:pk>` подставить id Пользователя

> `/api/users/<int:pk>/fio/` - GET, HEAD, OPTIONS - Вывод фамилии, имени, отчества пользователя по id в БД, вместо `<int:pk>` подставить id Пользователя

> `/api/users/superusers/` - GET, HEAD, OPTIONS - Вывод данных всех суперпользователей

#### Фильтры:

> `/api/users/?login=<логин>/` - GET, POST, HEAD, OPTIONS - Вывод данных пользователей отфильтрованных по части логина (фильтрация в БД username__contains), вместо `<логин>` подставляем часть (можно даже 1-2 буквы) уникального логина пользователя. Настроено вручную стандартными методами

> `/api/users/?first_name=<имя>&middle_name=<фамилия>&last_name=<отчество>/` - GET, HEAD, OPTIONS - Вывод данных пользователей, отфильтрованных по части имени, части фамилии, части отчества вместо `<имя>` подставляем часть имени, вместо `<фамилия>` часть фамилии, вместо `<отчество>` часть отчества пользователей. Некоторые данные можно опускать или комбинировать, в том числе с другими методами фильтрации, как например по части логина выше. Настроено с помощью кастомного `django-filter`

> `/api/users/?limit=<лимит>&offset=<смещение>/` - GET, POST, HEAD, OPTIONS- В поле `<лимит>` указываем количество пользователей, чьи данные придут в ответе на запрос, в поле `<смещение>` - смещение относительно первого пользователя. В ответ кроме пользователей приходят ссылки на смещение относительно страницы и другие данные

### Проекты

#### Система прав:
> 1. Администраторы (Джанговские и из моих групп зависимостей) могут всё.
> 2. Изменять данные могут пользователи, которые работают с проектом.
> 3. Удалить проект могут пользователи, которые работают с проектом.
> 4. Создать проект может любой пользователь, если авторизован.
> 5. Читать данные могут все. Но не все данные включены в сериализаторе

> `/api/projects/` - GET, POST, HEAD, OPTIONS - Список проектов, создание проекта.

> `/api/projects/<int:pk>/` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - Вывод, редактирование, удаление проекта, вместо `<int:pk>` подставить id Проекта

#### Фильтры:

> `/api/projects/?name=<имя>/` - GET, POST, HEAD, OPTIONS - Вывод данных проектов, отфильтрованных по части имени, вместо `<имя>` подставляем часть имени проектов. Настроено с помощью кастомного `django-filter`

> `/api/projects/?limit=<лимит>&offset=<смещение>/` - GET, POST, HEAD, OPTIONS - В поле `<лимит>` указываем количество проектов, данные которых придут в ответе на запрос, в поле `<смещение>` - смещение относительно первого проекта. В ответ кроме проектов приходят ссылки на смещение относительно страницы и другие данные

### Заметки

#### Система прав:
> 1. Администраторы (Джанговские и из моих групп зависимостей) могут всё.
> 2. Изменять данные может создатель заметки.
> 3. Удалить заметку может её создатель.
> 4. Создать заметку может любой пользователь, если авторизован.
> 5. Читать данные могут все. Но не все данные включены в сериализаторе

> `/api/todos/` - GET, POST, HEAD, OPTIONS - Список заметок, создание заметки.

> `/api/todos/<int:pk>/` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - Вывод, редактирование, удаление заметки (Метод переопределён! Вместо фактического удаления активность меняется на 0 (False)), вместо `<int:pk>` подставить id Заметки

#### Фильтры:

> `/api/todos/?created_after=<начало>&created_before=<конец>&project=<id>&project__name=<имя>/` - GET, POST, HEAD, OPTIONS - Вывод данных заметок. Фильтрация заметок по дате, в поле `<начало>` - указываем от какой даты считаем, в поле `<конец>` - до какой даты. Фильтрация заметок по id, поле `<id>`, в браузере можно сразу выбрать проект. Фильтрация заметок по имени проекта, поле `<имя>`. Достаточно использовать 1 из фильтров или использовать комбинации. Настроено с помощью кастомного `django-filter`, некоторые поля дефолтные

> `/api/todos/?limit=<лимит>&offset=<смещение>/` - GET, POST, HEAD, OPTIONS - В поле `<лимит>` Указываем количество заметок, данные которых придут в ответе на запрос, в поле `<смещение>` - смещение относительно первой заметки. В ответ кроме заметок приходят ссылки на смещение относительно страницы и другие данные

## Консольные команды в рамках проекта для запуска моих скриптов:

> `python manage.py add_all_data` - Скрипт единой точки создания всех дефолтных данных в БД. Данные собираются рандомно

> `python manage.py add_roles` - Скрипт заполнения таблиц БД дефолтными группами прав, ролями

> `python manage.py add_users` - Скрипт заполнения таблиц БД дефолтным админом и пользователями. Так же админ добавляется в группу разрешений Администратор, остальные дефолтные пользователи попадают в рандомные группы разрешений из БД (но не в группу Администраторов!). В группу Владелец проекта будут так же попадать те, кто будут создавать свои проекты. В группу Разработчик будут попадать те, кто оставляют заметки. Администраторов смогут назначать только администраторы.

> `python manage.py add_projects` - Скрипт заполнения таблиц БД дефолтным проектами, те в свою очередь связываются с рандомными дефолтными пользователями из БД, работающими с конкретными проектами

> `python manage.py add_todos` - Скрипт заполнения таблиц БД дефолтным заметками, каждая привязывается к конкретным рандомному проекту и конкретным рандомному пользователю из БД

# Полезные команды:

> `curl <address>` - FTP-клиент / HTTP-клиент - В поле `<address>` указываем необходимый ресурс и получаем данные как например JSON по API, так и целого сайта и т.д.

### Консольные команды Git:
> `git reset --hard <hash>` - Жесткое удаление коммита. Вместо `<hash>` - хэш-код коммита, к которому хотим вернуться
> 
> `git push --force` - Принудительно запушить изменения в `GitHub`. Например, перед этим можно выполнить действие выше и коммит удалится не только на ПК, но и на `GitHub` 

### Консольные команды Backend-а (Python, Django, DRF)

> `python venv env` - Создание виртуального окружения

> `pip install django djangorestframework markdown django-filter` - Установка зависимостей, полезных библиотек

> `pip freeze > requirements.txt` - Помещаем все зависимости проекта в файл `requirements.txt`

> `pip install -r requirements.txt` - Устанавливаем все зависимости проекта из файла `requirements.txt`

> `pip list` - Удобное отображение всех установленных приложений, библиотек

> `django-admin startproject config` - Создание проекта 'config'

> `python manage.py startapp users` - Создание приложения 'Пользователи'

> `python manage.py makemigrations` - Создание миграций, необходимо после создания/обновления моделей

> `python manage.py migrate` - Выполнение миграций

> `python manage.py sqlmigrate <app_name>` - Выполняется после создания миграций. Позволяет вывести на экран SQL-запросы, которые будут генерироваться для Django командой применения миграций к базе данных (то есть к таблицам, соответствующим указанному приложению)

> `python manage.py collectstatic` - Сборка стандартных и подготовленных статических файлов

> `python manage.py createsuperuser` - Создание супер-пользователя

> `python manage.py runserver 0.0.0.0:3333` - Запуск проекта на порту 3333 (доступ http://localhost:3333)

> `python manage.py test` - Запуск всех созданных тестов для приложений

#### Работа с дампами БД. В проекте не использую, так как не поддерживается кириллица. Использую export БД в json файл от IDE Pycharm, дампы в каталоге `dumps_pycharm_export`

> `python manage.py dumpdata --indent 2 --exclude auth.permission --exclude contenttypes > ./json/dumps_django_dumpdata/all_data.json` - Дамп всей БД, за исключением некоторых таблиц `--exclude auth.permission` и `--exclude contenttypes`, мешающих восстановлению БД из дампа. `--indent 2` - количество отступов в json файле
> 
> `python manage.py dumpdata users > ./json/dumps_django_dumpdata/users_data.json` - Дамп БД приложения `users`
> 
> `python manage.py dumpdata todo.project > ./json/dumps_django_dumpdata/todo_project_data.json` - Дамп БД конкретной таблицы модели `project` приложения `todo`
> 
> `python manage.py dumpdata todo.todo > ./json/dumps_django_dumpdata/todo_todo_data.json` - Дамп БД конкретной таблицы модели `todo` приложения `todo`
> 
> `python manage.py loaddata ./json/dumps_django_dumpdata/all_data.json` - импорт данных из дампа

### Консольные команды Frontend-а (JavaScript, NodeJS, npx, React)

> `npx create-react-app frontend` - Создание/установка проекта на React + Babel, webpack и другие полезные зависимости для комфортной работы, `npx` - режим одноразового запуска, пакет для запуска пакетов без установки в систему.

> `npm run start` - Запуск фронтенд проекта, выполнять в корне фронта (в данном случае в каталоге frontend)

> `npx react-codemod rename-unsafe-lifecycles` - Переименовать все устаревшие жизненные циклы на их новые имена


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

> `docker exec -it <CONTAINER ID> bash` - Зайти в работающий контейнер 

> `docker volume inspect django-on-docker_postgres_data` - Проверить, что том (volume) был создан

> `docker rmi <CONTAINER ID>`, `docker rmi -f <CONTAINER ID>` - Удалить образ 

> `docker image rm <name_or_id>`, `docker container rm <name_or_id>`, `docker volume rm <name_or_id>` - Удалить образы, контейнеры, тома по названию или id

> `docker stop <CONTAINER ID>` - Приостановить контейнер 

> `docker start <CONTAINER ID>` - Запустить ранее остановленный контейнер 

> `docker restart <CONTAINER ID>` - Перегрузить контейнер 

> `docker ps`, `docker ps -a` - Посмотреть работающие и все контейнеры 

> `docker images` - Посмотреть список всех образов


#### Работа с django, manage.py (сервис web):

> `docker-compose exec web python manage.py flush --no-input ` - Очистка таблиц

> `docker-compose exec web python manage.py makemigrations --no-input` - Создание миграций

> `docker-compose exec web python manage.py migrate` - Запуск миграций

> `docker-compose exec web python manage.py collectstatic --no-input --clear` - Сборка стандартных и подготовленных статических файлов 


#### Вход в postgres (сервис db): 
> `docker-compose exec db psql --username=admin --dbname=db_name` - Вход в сервис `db`, а внутри него вход в postgres, имя `admin`, бд `db_name`
##### Внутри postgres: 
> ` # \l ` - Показать базы данных

> ` # \c db_name ` - Подключение к базе данных `db_name`

> ` # \dt ` - Список зависимостей

> ` # \q ` - Выход из postgres
