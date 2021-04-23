#!/bin/bash
# npm run migrate:docker Init_app_docker

shopt -s nullglob dotglob     # To include hidden files
files=(/home/app/src/migrations/*)
echo ${#files[@]}
if [ ${#files[@]} -gt 0 ]
  then 
    npm run build
    npm run migrate:up
  fi

npm run start:dev