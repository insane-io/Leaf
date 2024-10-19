import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CreateAxiosInstance from "../Axios";

const Listplace = () => {
  const axiosInstance = CreateAxiosInstance()
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]); // Renamed for consistency

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get('get_place/');
        // Assuming the response is an array of places, we can set them directly
        setPlaces(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchData(); // Call the fetch function
  }, []); // Empty dependency array to run once on component mount

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {places.map((place) => (
        <motion.div
          key={place.id}
          className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(`/places/${place.id}`)}
        >
          <img
            src={place.website} // Assuming the 'website' field holds the image URL
            alt={place.name}
            className="w-full h-64 object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
            whileHover={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold mb-2">{place.name}</h3>
            <p className="text-sm">{place.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default Listplace;
