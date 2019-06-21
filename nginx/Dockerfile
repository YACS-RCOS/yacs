FROM nginx:1.11.9

MAINTAINER Mark Robinson <robinm8@rpi.edu>

RUN rm /etc/nginx/nginx.conf && \
    rm /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/cache
RUN mkdir -p /etc/ssl/yacs

COPY ./ /etc/nginx/
