FROM node:18.12.1

WORKDIR /home/app
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

CMD [ "npm", "test" ]