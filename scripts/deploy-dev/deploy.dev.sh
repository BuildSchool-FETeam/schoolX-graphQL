#!/bin/bash

if [[ ${?} -ne 0 ]]
then
  exit 1
fi

INSTANCE='schoolx-dev-compute'
PROJECT='multi-k8s-320211'

COMMAND="""
  cd /home/superknife0511/schoolX-graphQL && 
  sudo git checkout dev &&
  sudo git pull origin dev &&
  sudo docker image prune -af &&
  sudo docker-compose down &&
  sudo docker pull superknife0512/schoolx-graphql &&
  sudo docker pull superknife0512/schoolx-python-server &&
  sudo docker pull superknife0512/schoolx-java-server &&
  sudo docker pull superknife0512/schoolx-js-server &&
  sudo docker-compose -f docker-compose.prod.yml up -d
"""

gcloud auth activate-service-account --key-file=./compute-service-account.json
gcloud compute ssh --project=$PROJECT --zone=us-east1-b $INSTANCE --command="$COMMAND" -q

echo "SUCCESS"
