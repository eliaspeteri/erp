import { Request, Response, Router } from 'express';
import passport from 'passport';

const controller: Router = Router();
controller.post(
  '/',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  }),
  (_req: Request, res: Response) => {
    res.redirect('/');
  }
);

export default controller;
