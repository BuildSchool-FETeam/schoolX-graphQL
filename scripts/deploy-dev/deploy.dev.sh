#!/usr/bin/env bash

if [[ ${?} -ne 0 ]]
then
  exit 1
fi

INSTANCE='schoolx-dev-compute'
PROJECT='multi-k8s-320211'

COMMAND="""
  sudo git stash &&
  sudo git pull origin dev &&
  cd /home/superknife0511/schoolX-graphQL &&
  docker-compose -f docker-compose.prod.yml down &&
  docker pull superknife0512/schoolx-graphql &&
  docker pull superknife0512/schoolx-python-server &&
  docker pull superknife0512/schoolx-java-server &&
  docker pull superknife0512/schoolx-js-server &&
  docker-compose -f docker-compose.prod.yml up -d
"""
gcloud auth activate-service-account --key-file=/app/compute-service-account.json
gcloud compute ssh --project=$PROJECT --zone=us-east1-b $INSTANCE --command="$COMMAND" -q

echo "SUCCESS"
