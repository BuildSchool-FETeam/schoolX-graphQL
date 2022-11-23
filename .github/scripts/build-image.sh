
docker build -t superknife0512/schoolx-graphql -f Dockerfile . 
# docker build -t superknife0512/schoolx-python-server -f ./servers/python/Dockerfile.dev ./servers/python 
# docker build -t superknife0512/schoolx-java-server -f ./servers/java/Dockerfile.dev ./servers/java 
# docker build -t superknife0512/schoolx-cpp-server -f ./servers/cpp/Dockerfile.dev ./servers/cpp 
# docker build -t superknife0512/schoolx-js-server -f ./servers/js/Dockerfile.dev ./servers/js

docker push superknife0512/schoolx-graphql
# docker build -t superknife0512/schoolx-java-server -f ./servers/java/Dockerfile.dev ./servers/java 
# docker push superknife0512/schoolx-python-server
# docker push superknife0512/schoolx-cpp-server
# docker push superknife0512/schoolx-js-server
