FROM node:18.12.1-alpine

RUN apk update
RUN apk add dos2unix && apk add bash

WORKDIR /home/app
COPY yarn.lock .
COPY package.json .
RUN yarn install

COPY . .
RUN yarn build
RUN dos2unix scripts/*.sh
CMD [ "npm", "run", "start" ]