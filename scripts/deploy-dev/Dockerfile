FROM google/cloud-sdk:latest

WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y dos2unix

COPY . .
COPY ./compute-service-account.json ./compute-service-account.json

RUN dos2unix *.sh

CMD [ "ls", "." ]