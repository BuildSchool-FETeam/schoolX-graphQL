FROM google/cloud-sdk:latest

RUN apt-get update -y
RUN apt-get install -y dos2unix

WORKDIR /app
COPY . .

RUN dos2unix *.sh

CMD [ "bash", "deploy.dev.sh" ]
