FROM ruby:2.2.3

MAINTAINER Richie Young <richiejoeyoung@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential nodejs --fix-missing --no-install-recommends

RUN mkdir -p /usr/src; \
    cd /usr/src; \
    wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.0.0-source.zip; \
    unzip phantomjs-2.0.0-source.zip; \
    rm phantomjs-2.0.0-source.zip; \
    cd phantomjs-2.0.0; \
    ./build.sh --confirm

RUN cp /usr/src/phantomjs-2.0.0/bin/phantomjs /usr/local/bin/phantomjs

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma
WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock $INSTALL_PATH
RUN bundle install

COPY . $INSTALL_PATH
