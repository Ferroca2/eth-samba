import { prisma } from "./database";

export const findExpiredProposals = async () => {
  const currentDate = new Date();
  const expiredProposals = await prisma.proposal.findMany({
    where: {
      end_time: {
        lt: currentDate, // 'lt' stands for 'less than'
      },
    },
    include: {
      protocol: true, // Assuming you might want to include related protocol data
      comments: true, // Including comments if necessary
    },
  });

  return expiredProposals;
}
