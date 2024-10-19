import React, { useState } from "react";
import Maps from "../Components/Maps";
import CreateaxiosInstance from "../Axios";

const RouteSearch = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [data, setData] = useState([])

  const axiosInstance = CreateaxiosInstance();

  const handleSearch = async () => {
    console.log("Source:", source, "Destination:", destination);
    try {
      const formData = new FormData();
      formData.append("current_location", source);
      formData.append("destination", destination);
      const res = await axiosInstance.post('/calculate-carbon-emissions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 mx-auto rounded-lg gap-5">
      <input 
        type="text" 
        className="border-2" 
        placeholder="Source" 
        value={source}
        onChange={(e) => setSource(e.target.value)} 
      />
      <input 
        type="text" 
        className="border-2" 
        placeholder="Destination" 
        value={destination}
        onChange={(e) => setDestination(e.target.value)} 
      />
      <button 
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={handleSearch}
      >
        Search
      </button>
      <Maps />
      <div className="border-2 w-11/12 min-h-40 border-black rounded-xl mt-10 fixed">
        hii
      </div>
    </div>
  );
};

export default RouteSearch;
