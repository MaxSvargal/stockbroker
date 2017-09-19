# Use an official Python runtime as a parent image
FROM node:8.4

# Set the working directory to /app
WORKDIR /src

# Install app dependencies
COPY package.json .

RUN npm install -g yarnpkg
RUN yarn install

COPY . .

# Make port 80 available to the world outside this container
EXPOSE 3010

CMD [ "yarn", "run", "worker:dev" ]
