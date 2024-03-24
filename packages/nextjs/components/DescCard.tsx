import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface DescCardProps {
  logo: string;
  name: string;
  members: string | number;
}

export const DescCard: React.FC<DescCardProps> = ({ logo, name, members }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div
      onClick={() => router.push(`/protocol/${name}`)}
      className="bg-base-100 rounded-lg px-4 py-8 w-64 h-80 transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer"
    >
      <div className="flex items-center flex-col justify-center">
        {/* Use Next.js Image for optimized image loading */}
        <div className="h-16 w-16 relative rounded-full overflow-hidden">
          <Image
            src={logo}
            alt={`${name} logo`}
            layout="fill" // You can use 'responsive' or 'fixed' depending on your design needs
            objectFit="cover" // This will cover the area of the div without stretching the image
            className="rounded-full"
          />
        </div>
        <div className="text-center my-2 mx-4">
          <p className="text-lg font-semibold">{name}</p>
          <div className="text-sm">
            {typeof members === "number" ? `${members.toLocaleString()} members` : `${members} members`}
          </div>
        </div>
        {isDarkMode ? (
          <div className="flex flex-col">
            <button className="mt-4 bg-base-100 text-white px-6 py-1 rounded hover:bg-base-300 transition-colors rounded-full border-2 border-white">
              Join
            </button>
            <button
              onClick={() => router.push(`/protocol/${name}/form`)}
              className="w-50 px-4 py-2 my-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            >
              Create Proposal
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <button className="mt-4 bg-base-100 text-black px-6 py-1 rounded hover:bg-base-300 transition-colors rounded-full border-2 border-base-300">
              Join
            </button>
            <button
              onClick={() => router.push(`/protocol/${name}/form`)}
              className="w-50 px-4 py-2 my-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-full active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            >
              Create Proposal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
