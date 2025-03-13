FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

USER node

ENTRYPOINT [ "./scripts/next.sh" ]
