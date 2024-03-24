"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { Divider } from "~~/components/Divider";
import { Spinner } from "~~/components/Spinner";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type PageProps = {
  params: { id: string };
};

interface Comment {
  id: string;
  creator: string;
  content: string;
  likes_count: string;
}

interface CardProps {
  id: string;
  title: string;
  creator: string;
  description: string;
  created_at: string;
  status: "Active" | "Inactive";
  comments: Comment[];
}

async function getData(id: string) {
  let proposal = [];

  try {
    // Perform a GET request using Axios
    const response = await axios.get(`https://eth-samba.onrender.com/proposal/${id}`);
    proposal = response.data; // The data is available in the `data` property
  } catch (error) {
    // Handle the error accordingly
    console.error("Failed to fetch proposal", error);
    // You might want to pass an error message as a prop and display it in the UI
  }

  // Pass data to the page via props
  return proposal as CardProps;
}

async function createComment(id: number, creator: string, content: string) {
  try {
    // Perform a POST request using Axios
    await axios.post(`https://eth-samba.onrender.com/comment`, {
      proposal_id: id,
      creator,
      content,
    });
  } catch (error) {
    // Handle the error accordingly
    console.error("Failed to create comment", error);
    // You might want to pass an error message as a prop and display it in the UI
  }
  // Pass data to the
}

const ProtocolPage: React.FC<PageProps> = ({ params }) => {
  const { address: connectedAddress } = useAccount();
  const [proposal, setData] = useState<CardProps>();
  const [isLoadingg, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommenting, setIsCommenting] = useState(true);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const [selectedOption, setSelectedOption] = useState("");

  const closeComments = () => {
    setIsCommenting(false);
    openDialog();
  };

  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "Voting",
    functionName: "voteForProposal",
    args: [params.id, selectedOption === "YAE" ? 0 : selectedOption === "ABSTAIN" ? 1 : 2],
    blockConfirmations: 1,
    onBlockConfirmation: (txnReceipt: { blockHash: any; }) => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useEffect(() => {
    getData(params.id).then((data: CardProps) => {
      setData(data);
      setLoading(false);
    });
  }, [params.id, proposal?.comments]);

  const commentt = async () => {
    if (params.id && connectedAddress) {
      await createComment(parseInt(params.id), connectedAddress, comment);
    }
    getData(params.id).then((data: CardProps) => {
      setData(data);
      setLoading(false);
    });
  };

  if (isLoadingg)
    return (
      <div className="flex items-center flex-col flex-grow justify-center w-full text-center bg-base-300">
        <Spinner />
      </div>
    );
  return (
    <div className="container mx-auto p-8 flex justify-between">
      <div className="max-w-3xl mx-8">
        <span className={`text-sm font-semibold py-1 px-3 rounded-full  bg-red-200 text-red-700`}>Inactive</span>
        <h1 className="text-4xl font-bold mt-4">{proposal?.title}</h1>
        <div>
          <Divider />
          <p className="font-bold">author: {proposal?.creator}</p>
          <p className="font-bold">created: {proposal?.created_at}</p>
          <Divider />
        </div>
        <p>{proposal?.description}</p>
      </div>
      {isCommenting ? (
        <div className="max-w-48">
          <h1 className="text-4xl font-bold mt-4">Comments</h1>
          <Divider />
          <div className="overflow-auto max-h-96">
            {proposal?.comments.map((comment) => (
              <div key={comment.id} className="flex-col justify-center items-center space-x-2">
                <Address address={comment.creator} />
                <div className="my-2 font-medium">{comment.content}</div>
              </div>
            ))}
          </div>
          <Divider />
          <form onSubmit={commentt} className="flex items-center justify-end mb-5 space-x-3 w-full">
            <input
              className="border-primary bg-base-100 text-base-content p-2 w-full rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
              type="text"
              value={comment}
              placeholder="Write your comment here"
              onChange={e => setComment(e.target.value)}
            />
            <button className="btn btn-sm btn-primary bg-blue-500 text-white" type="submit">
              Comment
            </button>
          </form>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full w-full" onClick={closeComments}>
            Close comments
          </button>
        </div>
      ) : (
        <div className="w-64">
          <h1 className="text-4xl font-bold mt-4">Vote</h1>
          <Divider />
          <div className="space-y-2">
            {["YAE", "NAY", "ABSTAIN"].map((option) => (
              <button
                key={option}
                className={`py-2 px-4 w-full text-left rounded-full flex justify-between items-center
                            ${
                              selectedOption === option
                                ? "border-2 border-gray-400 bg-base-100"
                                : "border border-gray-600 bg-base-200"
                            }
                            hover:border-gray-400 focus:outline-none`}
                onClick={() => setSelectedOption(option)}
              >
                {option}
                <span className={`${selectedOption === option ? "block" : "hidden"}`}>✓</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => writeAsync()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 w-full rounded-full focus:outline-none hover:bg-blue-600"
          >
            {isMining ? "Loading..." : "Vote"}
          </button>
        </div>
      )}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-base-100 bg-opacity-50 overflow-y-auto h-full w-full" onClick={closeDialog}>
          {/* Dialog Content */}
          <div
            className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-base-100"
            onClick={e => e.stopPropagation()} // Prevent click from closing dialog
          >
            <div className="mt-3 text-center">
              <div className="max-w-3xl mx-8">
                <span className={`text-sm font-semibold py-1 px-3 rounded-full bg-green-200 text-green-700`}>
                  Active
                </span>
                <h1 className="text-4xl font-bold mt-4">{proposal?.title}</h1>
                <div>
                  <Divider />
                  <p className="font-bold">author: {proposal?.creator}</p>
                  <p className="font-bold">created: {proposal?.created_at}</p>
                  <Divider />
                </div>
                <p>{proposal?.description}</p>
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
