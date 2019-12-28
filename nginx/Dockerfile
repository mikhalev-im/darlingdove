FROM nginx:1.15.8-alpine

COPY nginx/ /etc/nginx
RUN mkdir -p /var/nginx/client_body_temp/frontend
RUN mkdir -p /var/nginx/client_body_temp/backend
RUN mkdir -p /var/nginx/proxy_temp/frontend
RUN mkdir -p /var/nginx/proxy_temp/backend
RUN mkdir -p /var/www/darlingdove.ru/.well-known/acme-challenge

ARG CONFIG_PATH
ENV CONFIG_PATH $CONFIG_PATH

RUN ln -s $CONFIG_PATH /etc/nginx/sites-enabled/