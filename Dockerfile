FROM ruby:2.2.3

MAINTAINER Richie Young <richiejoeyoung@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential nodejs --fix-missing --no-install-recommends

RUN cd /usr/local/share; \
  wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.7-linux-x86_64.tar.bz2; \
  tar xjf phantomjs-1.9.7-linux-x86_64.tar.bz2; \
  ln -s /usr/local/share/phantomjs-1.9.7-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs;

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma
WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock $INSTALL_PATH
RUN bundle install

COPY . $INSTALL_PATH
