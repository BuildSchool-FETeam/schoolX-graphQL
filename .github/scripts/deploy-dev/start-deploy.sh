openssl aes-256-cbc -K $encrypted_f61f33b076e9_key -iv $encrypted_f61f33b076e9_iv -in compute-service-account.json.enc -out scripts/deploy-dev/compute-service-account.json -d 
docker build -t deploy-build ./scripts/deploy-dev
docker run deploy-build