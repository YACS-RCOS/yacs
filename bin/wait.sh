#!/bin/sh
# wait.sh

set -e

until psql -h "postgres" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - waiting 1 second"
  sleep 1
done
