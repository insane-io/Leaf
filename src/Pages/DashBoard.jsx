import React, { useState } from "react";
import Maps from "../Components/Maps"

const RouteSearch = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    console.log("Source:", source, "Destination:", destination);
  };

  const routes = [
    {name: 'Mumbai To Goa', route: []}
  ]

  return (
    <div className="bg-white shadow-lg p-6 max-w-4xl mx-auto rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Search for Routes</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-full">
            <label htmlFor="source" className="text-gray-700">From</label>
            <input
              type="text"
              id="source"
              placeholder="Enter source location"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
          <div className="text-2xl text-gray-500">⇄</div>
          <div className="w-full">
            <label htmlFor="destination" className="text-gray-700">To</label>
            <input
              type="text"
              id="destination"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008370]"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-[#008370] text-white px-4 py-2 rounded-md hover:bg-[#2e9989] focus:outline-none focus:ring-2 focus:ring-[#008370]"
        >
          Search
        </button>
      </div>
      <div className='grid grid-cols-2'>
        <Maps />
        <div className="border-2 border-black rounded-xl mt-10">
          {
            
          }
        </div>
      </div>
    </div>
  );
};

export default RouteSearch;
