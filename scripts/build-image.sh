echo "$DOCKER_PASSOWRD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker build -t superknife0512/schoolx-graphql -f Dockerfile . 
# docker build -t superknife0512/schoolx-python-server -f ./servers/python/Dockerfile.dev ./servers/python 
# docker build -t superknife0512/schoolx-java-server -f ./servers/java/Dockerfile.dev ./servers/java 
# docker build -t superknife0512/schoolx-js-server -f ./servers/js/Dockerfile.dev ./servers/js

docker push superknife0512/schoolx-graphql
# docker push superknife0512/schoolx-python-server
# docker push superknife0512/schoolx-java-server
# docker push superknife0512/schoolx-js-server
