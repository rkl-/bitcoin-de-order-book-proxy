FROM node:alpine
LABEL maintainer="romano.kleinwaechter@gmail.com"

WORKDIR /usr/local/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production=true

COPY . .

CMD [ "yarn", "run", "app" ]

