// components/Card.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";

interface CardProps {
  id: string;
  title: string;
  author: string;
  createdDate: string;
  status: "Active" | "Inactive";
}

export const ProposalCard: React.FC<CardProps> = ({ id, title, author, createdDate, status }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/proposal/${id}`)}
      className="max-w-3xl rounded-lg overflow-hidden shadow-md bg-base-100 p-4 mb-4 transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer"
    >
      <div className="flex-col items-center mb-4">
        <div className="flex justify-between items-center p-4">
          <div className="flex-shrink-0">
            <Address address={author} />
          </div>
          <span
            className={`text-sm font-semibold py-1 px-3 rounded-full ${
              status === "Active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="flex-1 px-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p>author: {author}</p>
          <p>created: {createdDate}</p>
        </div>
      </div>
      {/* Additional content here */}
    </div>
  );
};
