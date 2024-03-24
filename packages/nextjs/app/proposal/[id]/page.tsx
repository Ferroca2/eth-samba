"use client";

import React from "react";
import { description } from "./example";
import { useAccount } from "wagmi";
import { Divider } from "~~/components/Divider";
import { SearchBar } from "~~/components/SearchBar";
import { Address } from "~~/components/scaffold-eth";

type PageProps = {
  params: { id: string };
};
interface CardProps {
  id: string;
  title: string;
  author: string;
  description: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

const ProtocolPage: React.FC<PageProps> = ({ params }) => {
  const { address: connectedAddress } = useAccount();
  const cards: CardProps = {
    id: params.id,
    title: "[ARFC] GHO Stewards + Borrow Rate Update",
    author: "@karpatkey_TokenLogic + @ACI + @ChaosLabs",
    createdDate: "2024-03-13",
    description,
    status: "Active",
  };

  return (
    <div className="container mx-auto p-8 flex justify-between">
      <div className="max-w-3xl mx-8">
        <span
          className={`text-sm font-semibold py-1 px-3 rounded-full ${
            cards.status === "Active" ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          {cards.status}
        </span>
        <h1 className="text-4xl font-bold mt-4">{cards.title}</h1>
        <div>
          <Divider />
          <p className="font-bold">author: {cards.author}</p>
          <p className="font-bold">created: {cards.createdDate}</p>
          <Divider />
        </div>
        <p>{cards.description}</p>
      </div>
      <div className="max-w-48">
        <h1 className="text-4xl font-bold mt-4">Comments</h1>
        <Divider />
        <div className="overflow-auto max-h-96">
          {" "}
          {/* Set the height to your preference */}
          <div className="flex-col justify-center items-center space-x-2">
            <Address address={connectedAddress} />
            <div className="my-2 font-medium">Very cool proposal, but blabalbal balbalbal blablalß</div>
          </div>
          <div className="flex-col justify-center items-center space-x-2">
            <Address address={connectedAddress} />
            <div className="my-2 font-medium">Very cool proposal, but blabalbal balbalbal blablalß</div>
          </div>
          <div className="flex-col justify-center items-center space-x-2">
            <Address address={connectedAddress} />
            <div className="my-2 font-medium">Very cool proposal, but blabalbal balbalbal blablalß</div>
          </div>
          <div className="flex-col justify-center items-center space-x-2">
            <Address address={connectedAddress} />
            <div className="my-2 font-medium">Very cool proposal, but blabalbal balbalbal blablalß</div>
          </div>
          {/* Place additional content that should be inside the scrollable area here */}
        </div>
        <Divider />
        <SearchBar />
      </div>
    </div>
  );
};

export default ProtocolPage;
