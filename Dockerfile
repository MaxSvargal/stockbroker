FROM node:8

WORKDIR /services
ADD package.json .
RUN npm install -g yarnpkg pm2 ts-node
RUN pm2 install typescript
RUN yarn install

ADD . .

CMD ["pm2-docker", "process.yml"]
