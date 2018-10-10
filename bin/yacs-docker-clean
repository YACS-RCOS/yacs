#!/usr/bin/env bash

function maybe_do {
    echo '   >' "$@"
    echo ''
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) "$@" ; break ;;
            No ) break;;
        esac
    done
}

echo ''
echo "Clean stopped docker containers?"
maybe_do docker rm $(docker ps -a -q)

echo ''
echo "Clean dangling docker images?"
maybe_do docker rmi -f $(docker images -q -a -f dangling=true)

echo ''
echo "Clean dangling docker volumes?"
maybe_do docker volume rm $(docker volume ls -qf dangling=true)