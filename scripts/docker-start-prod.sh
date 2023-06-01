#!/bin/bash

yarn build
yarn migrate:docker

if [[ ${?} -eq 0 ]] 
then
  yarn migrate:up
fi

yarn start