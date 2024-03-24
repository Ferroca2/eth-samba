"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProtocolCard } from "~~/components/ProtocolCard";
import { Spinner } from "~~/components/Spinner";

interface Community {
  image_url: string;
  title: string;
  members: string;
}

async function getData() {
  let communities = [];

  try {
    // Perform a GET request using Axios
    const response = await axios.get("https://eth-samba.onrender.com/protocol");
    communities = response.data; // The data is available in the `data` property
  } catch (error) {
    // Handle the error accordingly
    console.error("Failed to fetch communities", error);
    // You might want to pass an error message as a prop and display it in the UI
  }

  // Pass data to the page via props
  return communities as Community[];
}

// eslint-disable-next-line @next/next/no-async-client-component
const Home = () => {
  const [communities, setData] = useState<Community[]>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getData().then((data: Community[]) => {
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
    <>
      <div className="flex items-center flex-col flex-grow">
        <div className="flex-grow bg-base-300 w-full px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {communities?.map((community, index) => (
                <ProtocolCard key={index} logo={community.image_url} name={community.title} members="100K" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
