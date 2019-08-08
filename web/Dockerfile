FROM node:10-alpine

ENV APP_DIR /usr/src/app/
RUN mkdir -p $APP_DIR
RUN mkdir -p $APP_DIR/bin
RUN mkdir -p $APP_DIR/src
WORKDIR $APP_DIR

RUN npm cache clean --force && npm config set package-lock false
RUN npm install @angular/cli@6.1.3 -g --verbose
COPY package.json $APP_DIR

# npm packages are installed at runtime, not buildtime.
# this is done because volumes are not accessible during image building.
# node_modules and npm-cache are available at runtime, so running
# npm install every time the container is started is still efficient.

COPY angular.json karma.conf.js protractor.conf.js tsconfig.json tslint.json $APP_DIR
COPY ./src $APP_DIR

# You don't want to declare volumes inside Dockerfiles. The necessary volumes are already declared via. docker-compose.yml.
# https://boxboat.com/2017/01/23/volumes-and-dockerfiles-dont-mix/

# VOLUME /usr/src/app/dist-web
# VOLUME /usr/src/app/node_modules
# VOLUME /root/.npm
