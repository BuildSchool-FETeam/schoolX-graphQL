#!/bin/bash
echo "Generate migrations..."
mkdir src/migrations
yarn migrate:gen > result.txt


if [[ $(grep "No changes in database" ./result.txt) ]]
then
    echo "No need to run migration"
    exit 0
fi

yarn run migrate:up

if [[ $? -eq 0 ]]; then
    ls /tmp/
    # rm old file in /tmp
    rm -r /tmp/*
    # Copy migation file to /tmp
    cp src/migrations/* /tmp
fi