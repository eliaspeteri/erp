import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

export default app;
