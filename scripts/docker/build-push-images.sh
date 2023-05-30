#!/bin/bash

function usage() {    
    echo """Usage: command [-v|VERSION] [-p|PUSH TO REGISTRY] [-c|BUILD CONTEXT|default .]
        <App-components - [graphql|mini-js|mini-java|mini-cpp|mini-python]> 
        <env - [dev|staging|prod]> """
    echo "Exp: command graphql dev"
    echo "Exp: command -v 1.01 graphql dev "
}

VERSION='latest'
BUILD_CONTEXT='.'
while getopts 'v:pc:' opt
do
  case $opt in
    v) VERSION="$OPTARG" ;;
    p) IS_PUSH=1;;
    c) BUILD_CONTEXT="$OPTARG"
  esac
done

shift $(($OPTIND - 1))

APP_COMPONENT=$1
ENV=$2

if [[ ! $APP_COMPONENT || ! $ENV ]]; then
    usage
    exit 1
fi

if [[ ! $APP_COMPONENT =~ ^(graphql|mini-js|mini-java|mini-cpp|mini-python)$ ]]; then
    echo "Check your app-component params"
    usage
    exit 1
fi

if [[ ! $ENV =~ ^(dev|staging|prod)$ ]]; then
    echo "Check your env params"
    usage
    exit 1
fi

TAG="prisdom/$APP_COMPONENT:$VERSION-$ENV"
echo "Build and push server with tag $TAG"
echo "Build context: $BUILD_CONTEXT"
sudo docker build -f $BUILD_CONTEXT/Dockerfile $BUILD_CONTEXT -t "$TAG"

if [[ IS_PUSH -eq 1 ]]; then
    echo "Try to pushing docker image $TAG"
    docker push "$TAG"
    if [[ $? -eq 0 ]]; then
        echo "Push image successfully"
        exit 0
    fi
fi
