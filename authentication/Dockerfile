# node.dockerfile
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:latest

# Create app directory
WORKDIR /usr/src/authentication

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start:prod" ]
