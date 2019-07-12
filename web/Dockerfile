FROM node:10-alpine

ENV APP_DIR /usr/src/app/
RUN mkdir -p $APP_DIR
RUN mkdir -p $APP_DIR/bin
RUN mkdir -p $APP_DIR/src
WORKDIR $APP_DIR

# this is the NPM cache
VOLUME /root/.npm

RUN npm install -g @angular/cli@6.1.3 --depth 1

COPY package.json angular.json karma.conf.js protractor.conf.js tsconfig.json tslint.json $APP_DIR
COPY ./src $APP_DIR

VOLUME /usr/src/app/dist-web
