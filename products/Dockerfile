# node.dockerfile
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:14 as ts-compiler

# Create app directory
WORKDIR /usr/products

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . ./

RUN npm run compile

FROM node:14 as ts-remover
WORKDIR /usr/products
COPY --from=ts-compiler /usr/products/package*.json ./
COPY --from=ts-compiler /usr/products/dist ./
COPY --from=ts-compiler /usr/products/.env ./
COPY --from=ts-compiler /usr/products/prisma ./prisma/
RUN npm install --only=production

FROM gcr.io/distroless/nodejs:14
WORKDIR /usr/products
COPY --from=ts-remover /usr/products ./
USER 1000

EXPOSE 8080

CMD ["index.js"]
