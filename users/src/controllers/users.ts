import { PrismaClient } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/data-proxy';
import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../utils';
import crypto from 'crypto';

const controller: Router = Router();
const prisma = new PrismaClient();

controller.get('/', async (req: Request, res: Response) => {
  if (req.query.username)
    return res.status(200).json(
      await prisma.user.findFirst({
        where: {
          username: req.query.username as string
        }
      })
    );
  return res.status(200).json(prisma.user.findMany());
});

controller.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { email, username, name, role = 'USER', password } = req.body;
  logger.info({ body: req.body, headers: req.headers, query: req.query });
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310_000,
      32,
      'sha256',
      async (err, hashedPassword) => {
        if (err) return next(err);
        const prismaResponse = await prisma.user.create({
          data: {
            email: email,
            username: username,
            name: name,
            role: role,
            emailVerified: false,
            hashedPassword: hashedPassword,
            salt: salt
          }
        });
        return res.status(201).json(prismaResponse);
      }
    );
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
export default controller;
