# Bitcoin.de order book proxy
The API of [bitcoin.de](https://www.bitcoin.de/de) provides a web socket
connection for their order book data.  However, this implementaton seems
not to be modern and up to date, because they are full depended on the
[socket.io](https://socket.io/) library in the already outdated version
0.9.16. This is really annoying if you want to connect with modern
languages and tools to this interface and avoiding JavaScript.

This simple [nodejs](https://nodejs.org/en/) app, acts as a proxy between
the implementation of [bitcoin.de](https://www.bitcoin.de/de) and your
own software. You can easily connect to your own node and consume the
order book data.

For more flexibility, the app is already dockerized and ready to use
for your application.


# Building (Docker)
This is one of the easiest ways.

## Pre-Requirements
Copy the file `env.dist` to `.env` and run `docker build -t
rkleinwaechter/bitcoin-de-order-book-proxy .`

Instead of `docker build`, you can also pull the latest image from [docker
hub](https://hub.docker.com/r/rkleinwaechter/bitcoin-de-order-book-proxy/)
with `docker pull rkleinwaechter/bitcoin-de-order-book-proxy`.

## Run
Now you can start your container with:
```sh
docker run \
       -d \
       -rm \
       -p 8080:8080 \
       --env-file .env \
       --name bitcoin-de-order-book-proxy \
       rkleinwaechter/bitcoin-de-order-book-proxy
```
Your web socket proxy is now listening on localhost on port 8080.


# Building (non Docker)
## Pre-Requirements
If you not already have yarn installed, please do it with `npm install
--global yarn`.  After that run `yarn install`.

## Tests
To see if all is working as expected you should run `yarn
run tests`.  The tests are depended on the data received from
[bitcoin.de](https://www.bitcoin.de/de) with a maximum timeout of 30
seconds.  Typically, the required data is retrieved within 10 till 20
seconds. Often also much faster.

## Run
Ensure that the following environment variables are set:
```
BITCOIN_DE_WS_URL=https://ws.bitcoin.de
BITCOIN_DE_WS_PORT=443
SERVER_PORT=8080
```

Now run `yarn run app`. Your web socket proxy is now listening on
localhost on port 8080.


# Using docker-compose
`docker-compose` is one of the most convenient ways to use containers
inside your own application.

A sample `docker-compose.yml` file could be this:
```
version: '3'

networks:
  app_tier:
    driver: bridge
    ipam:
     config:
       - subnet: 172.11.1.0/16

services:
  bitcoin_de_order_book_proxy:
    image: rkleinwaechter/bitcoin-de-order-book-proxy
    env_file:
      - <PATH-TO-DOCKERFILE-FOLDER>/.env
    networks:
      app_tier:
        ipv4_address: 172.11.1.1

  # your other services are here
  # ...
```

## RUN
A simple `docker-compose up [-d]` build and runs your container.
