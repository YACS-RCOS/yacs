FROM ruby:2.2.3

MAINTAINER Richie Young <richiejoeyoung@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential nodejs wget --fix-missing --no-install-recommends

ENV PHANTOMJS_VERSION 2.1.1
RUN \
  apt-get install -y vim git wget libfreetype6 libfontconfig bzip2 && \
#  mkdir -p /srv/var && \
  wget -q --no-check-certificate -O /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 https://github.com/paladox/phantomjs/releases/download/2.1.7/phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
  tar -xjf /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 -C /tmp && \
  rm -f /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 && \
  mv /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
#  ln -s /srv/var/phantomjs/bin/phantomjs /usr/bin/phantomjs && \
#  git clone https://github.com/n1k0/casperjs.git /srv/var/casperjs && \
#  ln -s /srv/var/casperjs/bin/casperjs /usr/bin/casperjs && \
#  apt-get autoremove -y

#RUN wget https://s3.amazonaws.com/travis-phantomjs/phantomjs-2.0.0-ubuntu-12.04.tar.bz2
#RUN tar -xjf phantomjs-2.0.0-ubuntu-12.04.tar.bz2
#RUN mv phantomjs /usr/local/phantomjs/bin/phantomjs

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma

WORKDIR $INSTALL_PATH
COPY Gemfile $INSTALL_PATH

RUN bundle install
COPY . $INSTALL_PATH

RUN mkdir -p /etc/puma/ssl
COPY nginx/ssl/ /etc/puma/ssl/
