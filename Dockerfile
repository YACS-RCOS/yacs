FROM node:7.7.4-alpine

ENV APP_DIR /usr/src/app/
RUN mkdir -p $APP_DIR
RUN mkdir -p $APP_DIR/bin
WORKDIR $APP_DIR

RUN npm install -g @angular/cli
COPY package.json $APP_DIR
COPY .angular-cli.json karma.conf.js protractor.conf.js tsconfig.json tslint.json $APP_DIR
RUN npm install

COPY ./src $APP_DIR
RUN npm build --prod
