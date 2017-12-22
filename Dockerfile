FROM node:latest

# set default workdir
WORKDIR /usr/src

# Add package.json to allow for caching
COPY package.json /usr/src/package.json

# Install app dependencies and build
RUN npm installng

# Bundle app source
COPY src /usr/src/
