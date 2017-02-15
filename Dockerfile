FROM node:argon

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

EXPOSE 3000
CMD [ "node", "server" ]
