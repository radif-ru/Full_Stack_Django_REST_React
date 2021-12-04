FROM nginx:1.21.4-alpine

COPY ./build /var/www
#RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
