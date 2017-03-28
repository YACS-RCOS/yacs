FROM node:7.7.4-alpine

ENV APP_DIR /usr/src/app

RUN mkdir -p $APP_DIR
ADD . $APP_DIR

WORKDIR $APP_DIR
RUN npm install

RUN npm build

EXPOSE 8000

CMD npm start
