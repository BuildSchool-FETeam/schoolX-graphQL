#!/bin/bash

function usage() {
    echo "Please provide DB_Password, OR Mailjest Credentials!"
    echo """Usage: ./setup.sh <DB_PASSWORD> <MAILJET_API_KEY> <MAILJET_SECRET_KEY> 
            [e, --environment|dev|staging|prod]"""
    exit 1
}

ENV='dev'
while getopts 'e:' opt
do
  case $opt in
    e) ENV="$OPTARG"
  esac
done

shift $(($OPTIND - 1))

DB_PASSWORD=$1
MAILJET_API_KEY=$2
MAILJET_SECRET_KEY=$3

if [[ ! $DB_PASSWORD || ! $MAILJET_API_KEY || ! $MAILJET_SECRET_KEY ]]; then
    usage
fi

if [[ ! $ENV =~ ^(dev|prod|staging)$ ]]; then
    echo "Please check your env!"
    usage
fi

echo "Setting up [$ENV] environment..."

kubectl describe ns $ENV

if [[ $? -eq 1 ]]; then
    kubectl create ns $ENV
fi

kubectl config set-context --current --namespace=$ENV

echo "Setting up secret..."
kubectl create -n $ENV secret generic be-credentials \
    --from-literal DB_PASSWORD="$DB_PASSWORD" \
    --from-literal MAILJET_API_KEY="$MAILJET_API_KEY" \
    --from-literal MAILJET_SECRET_KEY="$MAILJET_SECRET_KEY" \
    --from-literal JWT_SECRET="LocalSecret"

echo "Setting up configmap..."
kubectl apply -f k8s/$ENV/others/app-cm.yml

echo "Setting up database..."
kubectl apply -f k8s/$ENV/others/pv-pvc.yml
kubectl rollout status deployment db-deployment
if [[ $? -ne 0 ]]; then
    echo "DB doesn't exist yet, creating one..."
    kubectl apply -f k8s/$ENV/db-deployment-svc.yml
fi

if [[ $? -ne 0 ]]; then
    echo "Ready to use now :D"
fi
