FROM ruby:2.2.3

MAINTAINER Richie Young <richiejoeyoung@gmail.com>

RUN apt-get update && apt-get install -qq -y build-essential nodejs --fix-missing --no-install-recommends

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock $INSTALL_PATH
RUN bundle install

COPY . $INSTALL_PATH

RUN mkdir -p $INSTALL_PATH/tmp/pids/puma

RUN RAILS_ENV=production bundle exec rake assets:precompile
