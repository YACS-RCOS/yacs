FROM ruby:2.6.3

MAINTAINER Ada Young <ada@adadoes.io>

RUN apt-get update && apt-get install -qq -y build-essential nodejs wget postgresql-client --fix-missing --no-install-recommends

ENV PHANTOMJS_VERSION 2.1.14
RUN \
  apt-get install -y vim git wget libfreetype6 libfontconfig && \
  wget -q -O /tmp/phantomjs-$PHANTOMJS_VERSION http://rpi.edu/~robinm8/phantomjs && \
  mv /tmp/phantomjs-$PHANTOMJS_VERSION /usr/bin/phantomjs && \
  chmod +x /usr/bin/phantomjs

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma
RUN mkdir -p /etc/ssl/yacs

WORKDIR $INSTALL_PATH
COPY Gemfile Gemfile.lock $INSTALL_PATH

RUN bundle install
COPY . $INSTALL_PATH
