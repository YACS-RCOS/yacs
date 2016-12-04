FROM ruby:2.2.3

MAINTAINER Richie Young <richiejoeyoung@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential nodejs --fix-missing --no-install-recommends

ENV PHANTOMJS_VERSION 1.9.7

RUN apt-get install -y vim git wget libfreetype6 libfontconfig bzip2
RUN mkdir -p /srv/var
RUN wget -q --no-check-certificate -O /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2
RUN tar -xjf /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 -C /tmp
RUN rm -f /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2
RUN mv /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/ /srv/var/phantomjs
RUN ln -s /srv/var/phantomjs/bin/phantomjs /usr/bin/phantomjs
RUN git clone https://github.com/n1k0/casperjs.git /srv/var/casperjs
RUN ln -s /srv/var/casperjs/bin/casperjs /usr/bin/casperjs
RUN apt-get autoremove -y

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma

WORKDIR $INSTALL_PATH
COPY Gemfile $INSTALL_PATH

RUN bundle install
COPY . $INSTALL_PATH

RUN mkdir -p /etc/puma/ssl
COPY nginx/ssl/ /etc/puma/ssl/
