FROM google/cloud-sdk:latest

WORKDIR /app

RUN apt-get update -y
RUN apt-get install -y dos2unix

COPY . .

RUN dos2unix *.sh

CMD [ "ls", "." ]