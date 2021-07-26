FROM node:12.22.1

RUN apt-get update -y
RUN apt-get install -y dos2unix

WORKDIR /home/app
COPY package.json .
RUN npm install

RUN npm rebuild bcrypt --build-from-source

COPY . .
RUN dos2unix scripts/*.sh
RUN chmod 700 scripts/*.sh

CMD [ "npm", "run", "start" ]