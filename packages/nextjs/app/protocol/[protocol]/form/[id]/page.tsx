"use client";

import axios from "axios";
import React, { useState } from "react";
import { Spinner } from "~~/components/Spinner";
import { useAccount } from "wagmi";

type PageProps = {
  params: { id: string };
};


interface ProposalForm {
  title: string;
  description: string;
  discussionLink: string;
}

const CreateProposal: React.FC<PageProps> = ({ params }) => {
  const { address: connectedAddress } = useAccount();
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState<ProposalForm>({
    title: "",
    description: "",
    discussionLink: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  function waitTwoSeconds() {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000); // 2000 milliseconds = 2 seconds
    });
  }

  const handleSubmit = async () => {
    setLoading(true);
    const response = await axios.post("https://eth-samba.onrender.com/proposal", {
      protocol_id: params.id,
      creator: connectedAddress,
      description: form.description,
      title: form.title,
    });
    await waitTwoSeconds();
    console.log(response.data);
    setLoading(false);
    setForm({ title: "", description: "", discussionLink: "" });
  };

  return (
    <div className="bg-base-300 min-h-screen flex justify-center p-4">
      <div className="max-w-lg w-full bg-base-100 p-4 rounded-lg h-[28rem]">
        <form className="space-y-4">
          <div>
            <h1 className="font-bold text-lg">Create Proposal</h1>
            <label htmlFor="title" className="block text-md font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="appearance-none block w-full bg-base-100 border border-gray-400 rounded-full py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-md font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="block w-full bg-base-100 border border-gray-400 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="discussionLink" className="block text-md font-medium">
              Discussion (optional)
            </label>
            <input
              id="discussionLink"
              name="discussionLink"
              type="url"
              className="appearance-none block w-full bg-base-100 border border-gray-400 rounded-full py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
              value={form.discussionLink}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            {isLoading ? <Spinner /> : "Submit Proposal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
