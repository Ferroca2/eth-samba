import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import votingAbi from './utils/contractAbi.json';
import { prisma } from './utils/database';
import swaggerDocument from "./swagger.json";
import swaggerUi from 'swagger-ui-express';
import helmet from "helmet";
import cors from "cors";
import { ethers } from 'ethers';
import { getComments } from './utils/getComments';
import { getOpenAIResponse } from './utils/openai';
import { prompt } from './utils/prompt';
import { pinata } from './utils/ipfs';
import { CHAIN } from '@prisma/client';
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

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

// app.get('/test', async (req, res) => {
//   const test = await getOpenAIResponse();
//   res.send('Hello World!');
// });


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
                description: {
                  type: "string",
                  default: "this is a cool protocol",
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
    description
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
        description
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
        chain: true,
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
    //verify if the protocol exists
    const protocol = await prisma.protocol.findUnique({
      where: {
        id: parseInt(protocol_id),
      },
      select: {
        address: true,
        chain: true,
      }
    });

    if(!protocol) {
      return res.status(404).json({ error: 'Protocol not found' });
    }
    

    // const provider = new ethers.providers.JsonRpcProvider(
    //   protocol.chain == CHAIN.NEAR ? process.env.AURORA_PROVIDER : process.env.SCROLL_PROVIDER
    // );

    // // Create a contract instance
    // const contract = new ethers.Contract(
    //   protocol.chain == CHAIN.NEAR ? process.env.AURORA_CONTRACT_ADDRESS! : process.env.SCROLL_CONTRACT_ADDRESS!, 
    //   votingAbi.abi, 
    //   provider);

    // // Call the contract to get the Protocol struct for the given address
    // const object = await contract.protocols(protocol.address);

    //now + time in seconds
    const end_time = new Date(Date.now());

    const proposal = await prisma.proposal.create({
      data: {
        protocol_id: parseInt(protocol_id),
        creator,
        title, 
        description,
        end_time: end_time,
      },
    });

    return res.status(201).json(proposal);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error creating proposal' });
  }
});

app.get('/protocol/:protocol_name', async (
  req: Request,
  res: Response,
) => {
  /* #swagger.tags = ['Protocol']
    #swagger.description = 'Get info from a protocol' */

  const { protocol_name } = req.params;
    
  try {
    const proposals = await prisma.protocol.findUnique({
      where: {
        title: protocol_name,
      },
      select: {
        id: true,
        title: true,
        proposals: true,
        image_url: true,
        chain: true,
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
        creator: true,
        created_at: true,
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

app.post('/settle', async (
  req: Request, 
  res: Response
) => {
  /* #swagger.tags = ['Proposal']
    #swagger.description = 'Settle a Proposal' */

  /* #swagger.requestBody = {
        "@content": { 
          "application/json": {
            schema: {
              type: 'object',
              proposal_id: {
                title: {
                  type: "number",
                  example: "2"
                },
              }
            }
          }
        }
      }
  */
  
  const { proposal_id } = req.body;
  try {
    const proposal = await prisma.proposal.findUnique({
      where: {
        id: proposal_id
      },
      select: {
        title: true,
        description: true,
        protocol: {
          select: {
            description: true,
            address: true,
            chain: true,
          }
        }
      }
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const provider = new ethers.providers.JsonRpcProvider(
      proposal.protocol.chain == CHAIN.NEAR ? process.env.AURORA_PROVIDER : process.env.SCROLL_PROVIDER
    );

    const contract = new ethers.Contract(
      proposal.protocol.chain == CHAIN.NEAR ? process.env.AURORA_CONTRACT_ADDRESS! : process.env.SCROLL_CONTRACT_ADDRESS!,
      votingAbi.abi, 
      provider
    );


    const selected_comments = await getComments(proposal_id);

    const ai_response = await getOpenAIResponse(prompt(
      proposal.protocol.description,
      proposal.title,
      proposal.description,
      selected_comments,
    ));

    if (!ai_response) {
      return res.status(400).json({ error: 'Error settling protocol' });
    }

    const response = JSON.parse(ai_response);

    if (!response.counter_propose) {
      return res.status(400).json({ error: 'Error settling protocol' });
    } 
    if (!response.counter_propose.description) {
      return res.status(400).json({ error: 'Error settling protocol' });
    }

    const ipfs = await pinata.pinJSONToIPFS({
      description: response.counter_propose.description
    });

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

    await prisma.proposal.update({
      where: {
        id: proposal_id
      },
      data: {
        on_chain: true,
        title: response.counter_propose.title,
        description: response.counter_propose.description,
      }
    });


    await contract.connect(wallet).makeProposal(proposal.protocol.address, proposal_id, response.new_proposal.title, ipfs.IpfsHash);

    return res.status(200).json({ response });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error settling protocol' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
