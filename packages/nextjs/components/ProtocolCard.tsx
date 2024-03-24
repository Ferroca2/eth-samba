import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface ProtocolCardProps {
  logo: string;
  name: string;
  members: string | number;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({ logo, name, members }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div
      onClick={() => router.push(`/protocol/${name}`)}
      className="bg-base-100 rounded-lg px-4 py-8 w-64 transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer"
    >
      <div className="flex items-center flex-col justify-center">
        {/* Use Next.js Image for optimized image loading */}
        <div className="h-16 w-16 relative rounded-full">
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
          <button className="mt-4 bg-base-100 text-white px-6 py-2 rounded hover:bg-base-300 transition-colors rounded-full border-2 border-white">
            Join
          </button>
        ) : (
          <button className="mt-4 bg-base-100 text-black px-6 py-2 rounded hover:bg-base-300 transition-colors rounded-full border-2 border-base-300">
            Join
          </button>
        )}
      </div>
    </div>
  );
};
