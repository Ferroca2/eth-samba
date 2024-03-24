"use client";

import React, { useState } from "react";

interface ProposalForm {
  title: string;
  description: string;
  discussionLink: string;
  images: File[];
}

const CreateProposal: React.FC = () => {
  const [form, setForm] = useState<ProposalForm>({
    title: "",
    description: "",
    discussionLink: "",
    images: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "images") {
      // Assuming you have a file input for images
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        setForm({ ...form, images: Array.from(files) });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <div className="bg-base-300 min-h-screen flex justify-center p-4">
      <div className="max-w-lg w-full bg-base-100 p-4 rounded-lg h-[28rem]">
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="appearance-none block w-full bg-base-100 text-white border border-gray-400 rounded-full py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
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
              className="block w-full bg-base-100 text-white border border-gray-400 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
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
              className="appearance-none block w-full bg-base-100 text-white border border-gray-400 rounded-full py-2 px-3 leading-tight focus:outline-none focus:bg-base-300 focus:border-blue-500"
              value={form.discussionLink}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          >
            Submit Proposal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
