#!/usr/bin/env bash

mkdir -p ./data/postgres
mkdir -p ./data/redis
mkdir -p ./tmp/pids/puma

docker-compose down
docker-compose build
docker-compose run web rake db:create db:migrate
docker-compose run web rake assets:precompile
docker-compose up -d
