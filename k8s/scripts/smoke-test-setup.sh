#!/bin/bash

ENV=$1
HOST="http://gql.prisdom-$ENV.online"
RESPONSE_BE=$(curl -v "$HOST/health")

if [[ ($RESPONSE_BE =~ "Everything is ok") ]]; then
    echo "Smoke test passed, preparing for intensive smoke test:"
    pip install requests
    
else 
    echo "Smoke test failed"
    exit 1
fi