FROM node:10-alpine

ENV APP_DIR /usr/src/app/
RUN mkdir -p $APP_DIR
RUN mkdir -p $APP_DIR/bin
RUN mkdir -p $APP_DIR/src
WORKDIR $APP_DIR

RUN npm install -g @angular/cli@6.1.3 --silent --depth 1

COPY package.json angular.json karma.conf.js protractor.conf.js tsconfig.json tslint.json $APP_DIR
COPY ./src $APP_DIR

VOLUME /usr/src/npm-cache
RUN npm install --depth 0

VOLUME /usr/src/app/dist-web

