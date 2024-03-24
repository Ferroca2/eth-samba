import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { prisma } from './utils/database';
import swaggerDocument from "./swagger.json";
import swaggerUi from 'swagger-ui-express';
import helmet from "helmet";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));

// Serve your Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/protocol', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Protocol']
    #swagger.description = 'Create a Protocol' */

  /* #swagger.requestBody = {
        "@content": { 
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                id: {
                  type: "number",
                  example: "2"
                },
                title: {
                  type: "string",
                  default: "My Protocol",
                },
                address: {
                  type: "string",
                  default: "0x1234567890123456789012345678901234567890",
                },
                image_url: {
                  type: "string",
                  default: "https://example.com/image.png",
                },
              }
            }
          }
        }
      }
  */
  const {
    id, 
    title, 
    address,
    image_url,
  } = req.body;
  
  try {
    const existingProtocol = await prisma.protocol.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (existingProtocol) {
      return res.status(400).json({ error: 'Protocol ID already exists' });
    }

    await prisma.protocol.create({
      data: {
        id,
        title,
        address,
        image_url,
      }
    });

    return res.sendStatus(201); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating protocol' });
  }
});

app.get('/protocol', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Protocol']
    #swagger.description = 'Get all Protocols' */

  try {  
    const protocols = await prisma.protocol.findMany({
      select: {
        id: true,
        title: true,
        address: true,
        image_url: true,
      }
    });

    return res.status(200).json(protocols);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error fetching protocols' });
  }
});


app.post('/proposal', async (
  req: Request, 
  res: Response
) => {
  /* #swagger.tags = ['Proposal']
    #swagger.description = 'Create a Proposal' */
    /* #swagger.requestBody = {
        "@content": { 
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                protocol_id: {
                  type: "number",
                  example: "2"
                },
                title: {
                  type: "string",
                  default: "My Proposal",
                },
                creator: {
                  type: "string",
                  default: "0x1234567890123456789012345678901234567890",
                },
                description: {
                  type: "string",
                  default: "ipfs://QmXyZ",
                },
              }
            }
          }
        }
      }
    */
  const { protocol_id, creator, title, description } = req.body;

  try {
    const proposal = await prisma.proposal.create({
      data: {
        protocol_id: parseInt(protocol_id),
        creator,
        title, 
        description
      },
    });

    return res.status(201).json(proposal);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating proposal' });
  }
});

app.get('/protocol/:protocol_id', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Protocol']
    #swagger.description = 'Get info from a protocol' */

  const { protocol_id } = req.params;
    
  try {
    const proposals = await prisma.protocol.findMany({
      where: {
        id: parseInt(protocol_id as string),
      },
      select: {
        id: true,
        title: true,
        proposals: true
      }
    });

    return res.status(200).json(proposals);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error fetching proposals' });
  }
});

app.get('/proposal/:proposal_id', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Proposal']
    #swagger.description = 'Get a Proposal by ID' */

  const { proposal_id } = req.params;

  try {
    const proposal = (await prisma.proposal.findUnique({
      where: {
        id: parseInt(proposal_id as string),
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
    }));

    if(!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const commentIds = proposal.comments.map((comment) => comment.id);
    const likesPromises = commentIds.flat().map(
      (commentId) => prisma.like.count({ 
        where: { 
          comment_id: commentId 
        } 
      })
    );

    const likesCounts = await Promise.all(likesPromises);

    proposal.comments.forEach((comment:any, commentIndex) => {
      comment.likesCount = likesCounts[commentIndex];
    });

    return res.status(200).json(proposal); 
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error fetching proposal' });
  }
});

app.post('/like', async (
  req: Request, 
  res: Response
) => {
  /* #swagger.tags = ['Like']
    #swagger.description = 'Create a Like' */

  /* #swagger.requestBody = {
        "@content": { 
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                comment_id: {
                  type: "number",
                  example: "2"
                },
                address: {
                  type: "string",
                  default: "0x1234567890123456789012345678901234567890",
                },
              }
            }
          }
        }
      }
    */
  const { comment_id, address } = req.body;


  try{
    const like = await prisma.like.create({
      data: {
        comment_id: parseInt(comment_id),
        address,
      },
    });

    return res.status(201).json(like);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating like' });
  }
});

app.post('/comment', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Comment']
    #swagger.description = 'Create a Comment' */

  /* #swagger.requestBody = {
        "@content": { 
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                proposal_id: {
                  type: "number",
                  example: "2"
                },
                creator: {
                  type: "string",
                  default: "0x1234567890123456789012345678901234567890",
                },
                content: {
                  type: "string",
                  default: "This is a comment",
                },
              }
            }
          }
        }
      }
  */
  const { proposal_id, creator, content } = req.body;
  try {
    const comment = await prisma.comment.create({
      data: {
        proposal_id: proposal_id,
        creator,
        content,
      },
    });
    return res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating comment' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
