FROM ruby:2.5.1-alpine

RUN apk add --update ruby-dev build-ase

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY Gemfile $INSTALL_PATH
RUN bundle install

COPY . $INSTALL_PATH
RUN bundle exec iodine -p $PORT -t 1 -w 1

ENV ENTRY bundle exec iodine -p $PORT -t 1 -w 1  &&  bundle exec karafka server 
CMD $ENTRY

