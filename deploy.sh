#!/usr/bin/env bash

mkdir -p ./data/postgres
mkdir -p ./data/redis
mkdir -p ./tmp/pids/puma

docker-compose down
docker-compose build
docker-compose run web rm public/index.html
docker-compose run web bundle exec rake db:create db:migrate
docker-compose run web bundle exec rake assets:precompile
docker-compose up -d
