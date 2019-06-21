FROM ruby:2.6.3

MAINTAINER Ada Young <ada@adadoes.io>

RUN apt-get update && apt-get install -qq -y build-essential nodejs wget postgresql-client --fix-missing --no-install-recommends

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p /var/run/puma

WORKDIR $INSTALL_PATH
COPY Gemfile Gemfile.lock $INSTALL_PATH

RUN bundle install
COPY . $INSTALL_PATH

CMD bundle exec rails s

# RUN mkdir -p /etc/puma/ssl
# COPY nginx/ssl/ /etc/puma/ssl/
