#!/bin/sh
# start.sh

bin/wait.sh && bundle exec puma -C config/puma.rb