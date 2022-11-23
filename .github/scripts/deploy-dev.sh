#!/usr/bin/env bash

if [[ ${?} -ne 0 ]]
then
  exit 1
fi

INSTANCE='schoolx-dev-compute'
PROJECT='multi-k8s-320211'

COMMAND="""
  cd /home/superknife0511/schoolX-graphQL &&
  sudo docker-compose -f docker-compose.prod.yml down &&
  sudo docker pull superknife0512/schoolx-graphql &&
  sudo docker-compose -f docker-compose.prod.yml up -d
"""

gcloud auth activate-service-account --key-file="$HOME/compute-service-account.json"
gcloud compute ssh --project=$PROJECT --zone=us-east1-b $INSTANCE --command="$COMMAND" -q

echo "SUCCESS"
