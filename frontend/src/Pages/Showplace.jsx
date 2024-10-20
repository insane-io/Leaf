import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CreateAxiosInstance from "../Axios";

const Showplace = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const axiosInstance = CreateAxiosInstance();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axiosInstance.get('get_or_filter_places/');
        console.log(res.data)
        
        const formattedPlaces = res.data.map((place) => {
          let imagesArray;
          try {
            imagesArray = JSON.parse(place.images.replace(/'/g, '"'));
          } catch (error) {
            console.error('Error parsing images:', error);
            imagesArray = [];
          }

          return {
            ...place,
            images: Array.isArray(imagesArray) ? imagesArray : [imagesArray],
          };
        });
        
        setPlaces(formattedPlaces);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);
  
  const handleCardClick = (place) => {
    navigate(`/listplace/`, { state: { filter: { value: place} } });
  };

  // Filter and sort places based on search query
  const filteredPlaces = places
    .filter(place => place.city.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.city.localeCompare(b.city)); // Sort alphabetically by city

  return (
    <div className="mx-8 my-10 pt-5">
      <input
        type="text"
        placeholder="Search by city..."
        className="border rounded-lg p-2 mb-6 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="grid grid-cols-3 gap-5">
        {filteredPlaces.map(place => (
          <motion.div
            key={place.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleCardClick(place.city)} // Redirect on click
          >
            <img
              src={place.images[0] || 'placeholder-image-url.jpg'}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-bold opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {place.city}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Showplace;
