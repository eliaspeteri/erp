# ERP

## Table of Contents

0. [Table of Contents](#table-of-contents)
1. [Configuration](#configuration)
    1. [Node configuration](#node-configuration)
    2. [Express.js configuration](#expressjs-configuration)
    3. [Prisma configuration](#prisma-configuration)
2. [Controllers](#controllers)

---

## Configuration

This section can be partially skipped by running `create-ms.sh`. The shell script takes in a microservice name as an argument.

### Node configuration

Create new Node project.

```sh
mkdir <microservice-name>
cd <microservice-name>
pnpm init -y
```

---
Install boilerplate dependencies except Prisma.

```sh
pnpm i body-parser cors dotenv express
pnpm i --save-dev @types/{body-parser, cors, express, node} nodemon ts-node typescript
```

---
Add runtime scripts to package.json.

```json
"scripts": {
    "start:prod": "node dist/index.js",
    "compile": "tsc",
    "build": "npm run compile",
    "dev": "npm run start:dev",
    "start:dev": "nodemon --config nodemon.json src/index.ts",
},
```

---
Add `tsconfig.json`.

```json
{
  "compilerOptions": {

    /* Language and Environment */
    "target": "es5" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,

    /* Emit */
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,

    /* Interop Constraints */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    "noImplicitAny": true /* Enable error reporting for expressions and declarations with an implied `any` type.. */,
    "strictNullChecks": true /* When type checking, take into account `null` and `undefined`. */,
    "strictFunctionTypes": true /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */,
    "noImplicitThis": true /* Enable error reporting when `this` is given the type `any`. */,
    "alwaysStrict": true /* Ensure 'use strict' is always emitted. */,
    "noUnusedLocals": true /* Enable error reporting when a local variables aren't read. */,
    "noUnusedParameters": true /* Raise an error when a function parameter isn't read */,
    "noImplicitReturns": true /* Enable error reporting for codepaths that do not explicitly return in a function. */,
    "noFallthroughCasesInSwitch": true /* Enable error reporting for fallthrough cases in switch statements. */,
    
    /* Completeness */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}

```

---
Add `nodemon.json`.

```json
{
  "restartable": "rs",
  "ignore": [".git", "node_modules/", "dist/"],
  "watch": ["src/"],
  "execMap": {
    "ts": "node -r ts-node/register"
  },
  "ext": "js,json,ts"
}
```

---

### Express.js configuration

Copy the boilerplate into `/src`.

```ts
// index.ts
import app from './app';

import { createServer, Server } from 'http';

import { Config, logger } from './utils';

const server: Server = createServer(app);

try {
  server.listen(Config.PORT, (): void => {
    logger.info(`Connected successfully, url: ${Config.URL}:${Config.PORT}`);
  });
} catch (error) {
    logger.error(`Unable to run server.`);
}
```

```ts
// app.ts
import cors, {CorsOptions} from 'cors';

import express, { Application, Request, Response } from 'express';

import bodyParser from 'body-parser';

const app: Application = express();

const corsOptions: CorsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/health', (_req: Request, res: Response) => {
    return res.status(200).json({success: true});
});

app.get('/*', (_req: Request, res: Response) => {
    return res.status(404).json({success: false});
});

export default app;
```

```.env
# .env
URL=http://localhost
PORT=8080
```

---
Copy the boilerplate into `/src/utils`

```ts
// config.ts
import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: (process.env.PORT as string) || '8080',
  URL: (process.env.URL as string) || 'http://localhost'
};
```

```ts
// logger.ts
export const info = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

export const error = (...params: unknown[]): void => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Error: ', ...params);
  }
};

export default { info, error };
```

```ts
// index.ts
export { default as Config } from './config';
export { default as logger } from './logger';
```

---

### Prisma configuration

Install Prisma and initialise the datasource.

```sh
pnpm install prisma --save-dev
pnpx prisma init --datasource-provider sqlite
```

Verify that `DATABASE_URL` was added into `.env`.

---
Create the model or models.

```prisma
// prisma/schema.prisma
model User {
    id Int @id @default(autoincrement())
    email String @unique
    name String?
    role Role
}

model Role {
    id Int @id @default(autoincrement())
    type String
}
```

---
Migrate the schema.

```sh
pnpx prisma migrate dev --name init
```

---
Install Prisma Client.

```sh
pnpm install @prisma/client
```

## Controllers

```ts
// controllers/<controller>.ts
import { PrismaClient } from '@prisma/client';

import { Request, Response, Router } from 'express';

import { logger } from '../utils';

const controller: Router = Router();
const prisma = new PrismaClient();

export default controller;
```

### Create

```ts
// controllers/<controller>.ts
controller.post('/', async (req: Request, res: Response) => {
  const {
    title,
    manufacturer,
    price,
    barcode,
    width,
    height,
    depth,
    description
  } = req.body;
  logger.info({
    body: req.body,
    headers: req.headers,
    query: req.query
  });
  try {
    const prismaResponse = await prisma.product.create({
      data: {
        width: width,
        height: height,
        depth: depth,
        manufacturer: manufacturer,
        title: title,
        description: description,
        price: price,
        barcode: barcode
      }
    });
    return res.status(201).json(prismaResponse);
  } catch (error) {
    if (error instanceof PrismaClientValidationError)
      return res.status(400).json({
        success: false,
        status: 400,
        error: error,
        message: error.message
      });
    return res.status(500).json({
      success: false,
      status: 500,
      error: error,
      message: (error as any).message
    });
  }
});
```

### Read

```ts
// controllers/<controller>.ts
controller.get('/', async (req: Request, res: Response) => {
    try {
        let products;
        if (req.query.id)
            products = await prisma.product.findFirst({
                where: { id: parseInt(req.query.id as string) }
            });
        else products = await prisma.product.findMany();
        
        return res.status(200).json({ success: true, products })
    }
    catch (error) {
        return res.status(500).json({success: false, message: (error as any).message}, error: error)
    }
})
```

### Update

### Delete
