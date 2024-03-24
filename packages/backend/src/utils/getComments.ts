import { prisma } from "./database";
import axios from "axios";
import { getOpenAIFilter } from "./openai";
import { filterPrompt } from "./prompt";
import { parse } from "path";

export const getComments = async (proposal_id: number, max_amount = 20): Promise<Array<{ id: string, comment: string }>> =>  {
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposal_id,
    },
    select: {
      description: true,
      title: true,
      comments: true,
      protocol: {
        select: {
          description: true,
        },
      }
      
    }
  });

  const getCreatorAge = async (address: string) => {
    try {
      const response = await axios.get(`https://explorer.old.testnet.aurora.dev/api/v2/addresses/${address}/transactions`);
      const creatorInfo = response.data;
      const age = creatorInfo.items[creatorInfo.items.length - 1];
  
      const date = new Date(age.timestamp);
  
      return date;
    } catch (error) {
      console.error("Error fetching creator info:", error);
      return new Date(Date.now());
    }
  };

  const commentsWithAge = (await Promise.all(proposal!.comments.map(async (comment) => {
    const age = await getCreatorAge(comment.creator);
    return {
      ...comment,
      first_transaction: age,
    };
  }))).map((comment) => ({
    id: comment.id,
    content: comment.content,
    first_transaction: comment.first_transaction,
  }));

  const filtered = await getOpenAIFilter(filterPrompt(proposal!.protocol.description, proposal!.title, proposal!.description, commentsWithAge));

  const filterJSON = JSON.parse(filtered!).rejected_ids.map((id: number) => id);  

  const filteredComments = commentsWithAge.filter((comment) => !filterJSON.includes(comment.id));
  

  return filteredComments.map((comment, index) => ({
    id: index.toString(),
    comment: comment.content,
  })).slice(0, max_amount);
}