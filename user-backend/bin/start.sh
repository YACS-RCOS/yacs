#!/usr/bin/env bash
# Example Script to test running service

docker build . -t yacs-user-backend

# example with env vars:
# docker run \
#   -p 5000:5000 \
#   -e DB_NAME='yacs' \
#   -e DB_USER='root' \
#   -e DB_HOST='localhost:5432' \
#   yacs-user-backend:latest

docker run \
  -p 5000:5000 \
  yacs-user-backend:latest
