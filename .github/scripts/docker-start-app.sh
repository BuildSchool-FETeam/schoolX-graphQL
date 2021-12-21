#!/bin/bash

npm run build
npm run migrate:docker Init_app_docker

if [[ ${?} -eq 0 ]] 
then
  npm run build 
  npm run migrate:up
fi

npm run start:dev