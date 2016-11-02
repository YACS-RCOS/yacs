FROM nginx

MAINTAINER Mark Robinson <robinm8@keybase.io>

# RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 4096

COPY nginx.conf /etc/nginx/nginx.conf
COPY dhparam.pem /etc/nginx/ssl/dhparam.pem

COPY yacs.cer /etc/nginx/ssl/yacs.cer
COPY yacs.key /etc/nginx/ssl/yacs.key
