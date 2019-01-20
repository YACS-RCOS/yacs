FROM ruby:2.6.0-alpine

RUN apk add --update ruby-dev build-base
RUN apk --update add less

ENV INSTALL_PATH /usr/src/app/
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY Gemfile Gemfile.lock $INSTALL_PATH
RUN bundle install

COPY . $INSTALL_PATH

CMD ["ruby", "app.rb"]
