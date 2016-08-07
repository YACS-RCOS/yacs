FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

RUN rm /etc/nginx/conf.d/examplessl.conf

COPY nginx.conf /etc/nginx/nginx.conf

VOLUME "./:/usr/share/nginx/html/"