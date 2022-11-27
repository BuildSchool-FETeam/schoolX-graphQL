#!/bin/bash

npm run build
npm run migrate:docker /home/app/src/migrations/Init_app_docker

if [[ ${?} -eq 0 ]] 
then
  npm run migrate:up
fi

npm run start