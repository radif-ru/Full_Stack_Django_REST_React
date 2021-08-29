# Django REST framework. Проект «Библиотека».

### Консольные команды

>`python venv env` - создание виртуального окружения

>`pip install django djangorestframework markdown django-filter` - установка зависимостей, полезных библиотек

>`pip freeze > requirements.txt` - помещаем все зависимости проекта в файл `requirements.txt`

>`pip install -r requirements.txt` - устанавливаем все зависимости проекта из файла `requirements.txt`

>`pip list` - удобное отображение всех установленных приложений, библиотек

>`django-admin startproject library` - создание проекта "Библиотека"

>`python manage.py startapp authors` - создание приложения "Авторы"

>`python manage.py makemigrations` - создание миграций, необходимо после создания/обновления моделей

>`python manage.py migrate` - выполнение миграций

>`python manage.py createsuperuser` - создание супер-пользователя

>`python manage.py runserver 0.0.0.0:3333` - запуск проекта на порту 3333 (доступ http://localhost:3333)

### Дополнитльные консольные команды в рамках проекта:

>`python manage.py add_users` - создание админа и пользователей


## Методы API проекта

>`/api/author/` - GET, POST, HEAD, OPTIONS - в зависимости от метода запроса - вывод всех пользователей, создание пользователя и т.д.

>`/api/author/<int:pk>` - GET, PUT, PATCH, DELETE, HEAD, OPTIONS - в зависимости от метода запроса - вывод пользователя по id, редактирование, удаление и т.д.
