"use client";

import aaveLogo from "../public/aave-logo.jpeg";
import type { NextPage } from "next";
import { ProtocolCard } from "~~/components/ProtocolCard";

interface Community {
  logo: string;
  name: string;
  members: string;
}

const Home: NextPage = () => {
  const communities: Community[] = [
    { logo: aaveLogo.src, name: "Aave", members: "140K" },
    { logo: aaveLogo.src, name: "ENS", members: "129K" },
    // ... add more community objects here
  ];

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        <div className="flex-grow bg-base-300 w-full px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {communities.map((community, index) => (
                <ProtocolCard key={index} logo={community.logo} name={community.name} members={community.members} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
