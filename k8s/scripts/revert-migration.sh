#!/bin/bash

ls /tmp
# copy all file in /tmp into /src/migrations
mkdir src/migrations
cp /tmp/* src/migrations
# run migrations down
yarn run migrate:down
