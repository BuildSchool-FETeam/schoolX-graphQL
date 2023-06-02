#!/bin/bash
echo "Generate migrations..."
mkdir src/migrations
RESULT=$(yarn migrate:gen)

regex='No changes in database'

if [[ $RESULT =~ $regex ]]
then
    echo "No need to run migration"
    exit 0
fi

yarn run migrate:up

if [[ $? -eq 0 ]]; then
    # rm old file in /tmp
    rm -r /tmp/*
    # Copy migation file to /tmp
    cp src/migrations/* /tmp
fi

echo $RESULT