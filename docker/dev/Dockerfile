FROM node:10-alpine

WORKDIR /src
COPY . /src

RUN set -x \
  && npm i -g nodemon typescript concurrently ts-node \
  && yarn \
  && yarn build

FROM node:10-alpine

WORKDIR /app

COPY --from=0 /src/dist /app
COPY --from=0 /src/package.json /app
COPY --from=0 /src/yarn.lock /app

RUN set -x \
  && yarn install --prod \
  && yarn cache clean \
  && ls /app

CMD node /app/index.js
