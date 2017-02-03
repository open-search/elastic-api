FROM node:argon

RUN groupadd -r nodejs \
   && useradd -m -r -g nodejs nodejs

USER nodejs

WORKDIR /usr/src/app
#COPY package.json .
#RUN npm install --production
#COPY . .

EXPOSE 3000
CMD [ "node", "server" ]
