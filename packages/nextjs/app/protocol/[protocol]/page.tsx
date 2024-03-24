"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DescCard } from "~~/components/DescCard";
import { ProposalCard } from "~~/components/ProposalCard";
import { Spinner } from "~~/components/Spinner";

type PageProps = {
  params: { protocol: string };
};

interface Proposal {
  id: number;
  protocol_id: number;
  creator: string;
  title: string;
  description: string;
  end_time: string;
  on_chain: boolean;
  created_at: string;
  updated_at: string;
}
interface Protocol {
  id: number;
  title: string;
  proposals: Proposal[];
  image_url: string;
}

async function getData(protocol: string) {
  let proto = [];

  try {
    // Perform a GET request using Axios
    const response = await axios.get(`https://eth-samba.onrender.com/protocol/${protocol}`);
    proto = response.data; // The data is available in the `data` property
  } catch (error) {
    // Handle the error accordingly
    console.error("Failed to fetch proto", error);
    // You might want to pass an error message as a prop and display it in the UI
  }

  // Pass data to the page via props
  return proto as Protocol;
}

const ProtocolPage: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const [propo, setData] = useState<Protocol>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData(params.protocol).then((data: Protocol) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center flex-col flex-grow justify-center w-full text-center bg-base-300">
        <Spinner />
      </div>
    );
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Proposals</h1>
      <button
        onClick={() => router.push(`/protocol/${params.protocol}/form/${propo?.id}`)}
        className="w-50 px-4 py-2 my-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
      >
        Create Proposal
      </button>
      <div className="flex justify-between">
        <div>
          {propo?.proposals.map((card, index) => (
            <ProposalCard
              id={card.id.toString()}
              key={index}
              title={card.title}
              author={card.creator}
              createdDate={card.created_at}
              status={card.on_chain ? "Active" : "Inactive"}
            />
          ))}
        </div>
        <DescCard logo={propo!.image_url} name={propo!.title} members="100K" />
      </div>
    </div>
  );
};

export default ProtocolPage;
