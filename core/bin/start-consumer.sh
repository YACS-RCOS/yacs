#!/bin/sh
# start-consumer.sh

bin/wait.sh && bundle exec karafka server
