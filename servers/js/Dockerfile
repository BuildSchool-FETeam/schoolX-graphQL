FROM node:14-alpine

WORKDIR /home/app

COPY package.json .

RUN npm i

COPY . .

CMD ["npm", "start"]
