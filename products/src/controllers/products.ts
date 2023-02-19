import { PrismaClient } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/data-proxy';
import { Request, Response, Router } from 'express';
import { logger } from '../utils';

const controller: Router = Router();
const prisma = new PrismaClient();

controller.get('/', async (req: Request, res: Response) => {
  let products;
  if (req.query.id)
    products = await prisma.product.findFirst({
      where: { id: parseInt(req.query.id as string) }
    });
  else products = await prisma.product.findMany();
  return res.json({ success: true, products });
});

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
export default controller;
