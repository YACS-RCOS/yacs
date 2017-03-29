FROM node:7.7.4-alpine

ENV APP_DIR /usr/src/app/
RUN mkdir -p $APP_DIR
RUN mkdir -p $APP_DIR/bin
WORKDIR $APP_DIR

COPY package.json webpack.config.js $APP_DIR

RUN npm install webpack-dev-server@2.4.2 -g
RUN npm install

COPY ./src $APP_DIR
RUN npm build

