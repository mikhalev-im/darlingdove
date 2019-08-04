FROM nginx:1.15.8-alpine
COPY nginx/ /etc/nginx
RUN mkdir -p /var/nginx/client_body_temp/frontend
RUN mkdir -p /var/nginx/client_body_temp/backend
RUN mkdir -p /var/nginx/proxy_temp/frontend
RUN mkdir -p /var/nginx/proxy_temp/backend