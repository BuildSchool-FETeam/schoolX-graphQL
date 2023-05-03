FROM node:18.12.1

RUN apt-get update -y
RUN apt-get install -y dos2unix

WORKDIR /home/app
COPY package.json .
COPY yarn.lock .
RUN yarn config set unsafe-perm true
RUN yarn install

COPY . .
RUN dos2unix scripts/*.sh
CMD [ "npm", "run", "start" ]