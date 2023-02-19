import { Request, Response, Router } from 'express';

const controller: Router = Router();

controller.get('/', async (_req: Request, res: Response) => {
  return res.json({});
});

export default controller;
