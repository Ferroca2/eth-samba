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


app.post('/proposal', async (
  req: Request, 
  res: Response
) => {
  const { protocol_id, creator, title, description } = req.body;

  const proposal = await prisma.proposal.create({
    data: {
      protocol_id: parseInt(protocol_id),
      creator,
      title, 
      description
    },
  });

  return res.status(201).json(proposal);
});

app.get('/proposal', async (
  req: Request,
  res: Response,
) => {

  const proposals = await prisma.proposal.findMany({
    select: {
      id: true,
      protocol_id: true,
      title: true,
      description: true,
    }
  });

  return res.status(200).json(proposals); 
});

app.get('/proposal/:proposal_id', async (
  req: Request,
  res: Response,
) => {
  const { protocol_id } = req.params;
  const proposals = await prisma.proposal.findMany({
    where: {
      protocol_id: parseInt(protocol_id as string),
      on_chain: false,
    },
    select: {
      id: true,
      protocol_id: true,
      title: true,
      description: true,
      comments: {
        select: {
          id: true,
          creator: true,
          content: true,
        }
      }
    }
  });

  const commentIds = proposals.map((proposal) => proposal.comments.map((comment) => comment.id));
  const likesPromises = commentIds.flat().map(
    (commentId) => prisma.like.count({ 
      where: { 
        comment_id: commentId 
      } 
    })
  );

  const likesCounts = await Promise.all(likesPromises);

  proposals.forEach((proposal, index) => {
    proposal.comments.forEach((comment:any, commentIndex) => {
      comment.likesCount = likesCounts[index * proposal.comments.length + commentIndex];
    });
  });

  return res.status(200).json(proposals); 
});

app.post('/like', async (
  req: Request, 
  res: Response
) => {
  const { comment_id, address } = req.body;

  const like = await prisma.like.create({
    data: {
      comment_id: parseInt(comment_id),
      address,
    },
  });

  return res.status(201).json(like);
});

app.delete("/like/:id", async (
  req: Request, 
  res: Response
) => {
  const { comment_id, address } = req.body;
  await prisma.like.delete({ 
    where: { 
      address_comment_id: {
        address,
        comment_id: parseInt(comment_id),
      }
    } 
  });

  return res.sendStatus(204);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
