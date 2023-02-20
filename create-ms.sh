#!/bin/sh
mkdir $1
cd ./$1
npm init -y
npm i body-parser cors dotenv express @prisma/client
npm i --save-dev @types/{body-parser,cors,express,node} nodemon ts-node typescript prisma

cp -r ./templates/* .

npx prisma init --datasource-provider sqlite
