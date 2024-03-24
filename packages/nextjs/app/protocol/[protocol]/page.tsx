"use client";

import React from "react";
import { useRouter } from "next/navigation";
import aaveLogo from "../../../public/aave-logo.jpeg";
import { DescCard } from "~~/components/DescCard";
import { ProposalCard } from "~~/components/ProposalCard";

type PageProps = {
  params: { protocol: string };
};
interface CardProps {
  title: string;
  author: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

interface DescCardProps {
  logo: string;
  name: string;
  members: string | number;
}

const ProtocolPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const cards: CardProps[] = [
    {
      title: "[ARFC] GHO Stewards + Borrow Rate Update",
      author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
      createdDate: "2024-03-13",
      status: "Active",
    },
    {
      title: "[ARFC] GHO Stewards + Borrow Rate Update",
      author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
      createdDate: "2024-03-13",
      status: "Active",
    },
    {
      title: "[ARFC] GHO Stewards + Borrow Rate Update",
      author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
      createdDate: "2024-03-13",
      status: "Active",
    },
    {
      title: "[ARFC] GHO Stewards + Borrow Rate Update",
      author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
      createdDate: "2024-03-13",
      status: "Active",
    },
    {
      title: "[ARFC] GHO Stewards + Borrow Rate Update",
      author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
      createdDate: "2024-03-13",
      status: "Active",
    },
  ];

  const community: DescCardProps = { logo: aaveLogo.src, name: "Aave", members: "140K" };
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Proposals</h1>
      <button
        onClick={() => router.push(`/protocol/${params.protocol}/form`)}
        className="w-50 px-4 py-2 my-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
      >
        Create Proposal
      </button>
      <div className="flex justify-between">
        <div>
          {cards.map((card, index) => (
            <ProposalCard
              key={index} // Using index as key is not recommended for dynamic lists
              title={card.title}
              author={card.author}
              createdDate={card.createdDate}
              status={card.status}
            />
          ))}
        </div>
        <DescCard logo={community.logo} name={community.name} members={community.members} />
      </div>
    </div>
  );
};

export default ProtocolPage;
