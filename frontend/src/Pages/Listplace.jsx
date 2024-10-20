import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateAxiosInstance from "../Axios";
import Reviews from "../Components/Reviews";
import axios from 'axios';

const Listplace = () => {
  const axiosInstance = CreateAxiosInstance();
  const location = useLocation();
  const value = location.state?.filter?.value;
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [filters, setFilters] = useState({
    lessCrowd: false,
    mediumCrowd: false,
    largeCrowd: false,
    highestRating: false,
    mostVisited: false,
  });

  useEffect(() => {
    fetch('http://192.168.0.107:8000/filter_places?city=mumbai', {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'DNT': '1', // Do Not Track request header
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(data => {
      console.log(data);
  })
  .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
  });
  
  }, [])
  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  // Function to filter places based on the selected filters
  useEffect(() => {
    let updatedPlaces = [...places];

    if (filters.lessCrowd) {
      updatedPlaces = updatedPlaces.filter((place) => place.crowd === 'less');
    }
    if (filters.mediumCrowd) {
      updatedPlaces = updatedPlaces.filter((place) => place.crowd === 'medium');
    }
    if (filters.largeCrowd) {
      updatedPlaces = updatedPlaces.filter((place) => place.crowd === 'large');
    }
    if (filters.highestRating) {
      updatedPlaces = updatedPlaces.sort((a, b) => b.rating - a.rating);
    }
    if (filters.mostVisited) {
      updatedPlaces = updatedPlaces.sort((a, b) => b.visits - a.visits);
    }

    setFilteredPlaces(updatedPlaces);
  }, [filters, places]);

  return (
    <div className="p-6">
      {/* Filter Buttons */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Filter Places</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className={`px-4 py-2 rounded ${filters.lessCrowd ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('lessCrowd')}
          >
            Less Crowd
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.mediumCrowd ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('mediumCrowd')}
          >
            Medium Crowd
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.largeCrowd ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('largeCrowd')}
          >
            Large Crowd
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.highestRating ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('highestRating')}
          >
            Highest Rating
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.mostVisited ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('mostVisited')}
          >
            Most Visited
          </button>
        </div>
      </div>

      {/* Places List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <motion.div
            key={place.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/place/${place.id}`)}
          >
            <img
              src={place.images[0]} // Access the first image safely
              alt={place.name}
              className="w-full h-64 object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
              whileHover={{ opacity: 1 }}
            >
              <h3 className="text-2xl font-bold mb-2">{place.name}</h3>
              <p className="text-sm">{place.description}</p>
              <p className="text-sm">Crowd: {place.crowd}</p>
              <p className="text-sm">Rating: {place.rating}</p>
              <p className="text-sm">Visits: {place.visits}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <Reviews />
    </div>
  );
};

export default Listplace;
