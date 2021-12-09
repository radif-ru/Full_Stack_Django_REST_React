FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ARG HOME
ARG APP_HOME
ARG STATIC_FILES
ARG MEDIA_FILES

RUN mkdir -p $HOME

RUN adduser --system --group app

RUN mkdir $APP_HOME
RUN mkdir $STATIC_FILES
RUN mkdir $MEDIA_FILES

WORKDIR $APP_HOME

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . $APP_HOME

RUN chown -R app:app $APP_HOME

RUN chmod +x entrypoint.sh

USER app

ENTRYPOINT ["/home/app/backend/entrypoint.sh"]
