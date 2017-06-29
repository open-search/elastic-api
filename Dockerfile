FROM node:alpine

ENV user node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .

RUN \
  npm i --silent && \
  npm run test && \
  npm prune --production

COPY . .

ENV NODE_ENV=production
ENV ELASTIC_OBJECTS_PATH='./examples'

EXPOSE 3000
CMD [ "node", "server" ]
