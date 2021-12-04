#!/bin/sh

python manage.py add_all_data

gunicorn config.wsgi:application -b 0.0.0.0:3333 --reload
