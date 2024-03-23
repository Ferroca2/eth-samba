import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { prisma } from './utils/database';
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/protocol', async (
  req: Request,
  res: Response,
) => {
  const {
    id, 
    title, 
    address,
    image_url,
  } : {
    id: number, 
    title: string, 
    address: string,
    image_url: string,
  } = req.body;

  await prisma.protocol.create({
    data: {
      id,
      title,
      address,
      image_url,
    }
  });

  return res.sendStatus(201); 
});

app.get('/protocol', async (
  req: Request,
  res: Response,
) => {
  const protocols = await prisma.protocol.findMany({
    select: {
      id: true,
      title: true,
      address: true,
      image_url: true,
    }
  });

  return res.status(200).json(protocols); 
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
