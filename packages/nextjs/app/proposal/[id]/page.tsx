"use client";

import React, { useState } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

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
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full w-full" onClick={openDialog}>
          Close comments
        </button>
      </div>
      {isDialogOpen && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeDialog}>
          {/* Dialog Content */}
          <div
            className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-base-100"
            onClick={e => e.stopPropagation()} // Prevent click from closing dialog
          >
            <div className="mt-3 text-center">
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
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={closeDialog}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolPage;
