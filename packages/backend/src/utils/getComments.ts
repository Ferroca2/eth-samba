import { prisma } from "./database";

export const getComments = async (proposal_id: number, max_amount = 20): Promise<Array<{ id: string, comment: string }>> =>  {
  const comments = await prisma.comment.findMany({
    where: {
      proposal_id,
    },
    select: {
      content: true,
    }
  });
  
  return comments.map((comment, index) => ({
    id: index.toString(),
    comment: comment.content,
  })).slice(0, max_amount);
}