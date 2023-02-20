// app.ts
import cors, { CorsOptions } from 'cors';

import express, { Application, Request, Response } from 'express';

import bodyParser from 'body-parser';

import usersController from './controllers/users';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.use('/users', usersController);

app.get('/*', (_req: Request, res: Response) => {
  return res.status(404).json({ success: false });
});

export default app;
