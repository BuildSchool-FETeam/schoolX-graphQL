#!/bin/bash

yarn build
yarn migrate:docker /home/app/src/migrations/Init_app_docker

if [[ ${?} -eq 0 ]] 
then
  yarn migrate:up
fi

yarn start:dev