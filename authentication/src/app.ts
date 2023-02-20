import cors, { CorsOptions } from 'cors';

import express, { Application, Request, Response } from 'express';

import bodyParser from 'body-parser';

import authorizationController from './controllers/auth';

import passport from './middlewares/passport.middleware';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req: Request, res: Response) => {
  return res.status(200).json({ success: true });
});

app.use('/authorization', authorizationController);

app.get('/*', (_req: Request, res: Response) => {
  return res.status(404).json({ success: false });
});

export default app;
