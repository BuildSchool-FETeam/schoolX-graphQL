FROM google/cloud-sdk:latest

RUN apt-get update -y
RUN apt-get install -y dos2unix

WORKDIR /app
COPY . .
COPY ./scripts/deploy-dev/compute-service-account.json /app/compute-service-account.json

RUN dos2unix *.sh

CMD [ "ls", "." ]