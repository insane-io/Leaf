import React from 'react';
import { motion } from 'framer-motion';

const hotelsData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/150', // Placeholder image
    name: 'Ocean View Hotel',
    rating: 4,
    starCategory: '4 Star',
    price: '$120 per night',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/150', // Placeholder image
    name: 'Mountain Retreat',
    rating: 5,
    starCategory: '5 Star',
    price: '$250 per night',
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/150', // Placeholder image
    name: 'City Center Inn',
    rating: 3,
    starCategory: '3 Star',
    price: '$80 per night',
  },
  // Add more hotels as needed
];

const Listhotel = () => {
  return (
    <div className="p-6 space-y-4">
      {hotelsData.map((hotel) => (
        <motion.div
          key={hotel.id}
          className="flex items-center bg-white shadow-lg rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left - Hotel Image */}
          <div className="flex-shrink-0">
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-32 h-20 rounded-lg object-cover"
            />
          </div>

          {/* Middle - Hotel Details */}
          <div className="ml-4 flex-grow">
            <h4 className="font-bold text-lg">{hotel.name}</h4>
            <div className="flex items-center">
              {/* Rating Stars */}
              {[...Array(hotel.rating)].map((_, index) => (
                <span key={index} className="text-yellow-500">★</span>
              ))}
              {[...Array(5 - hotel.rating)].map((_, index) => (
                <span key={index} className="text-gray-300">★</span>
              ))}
              <span className="ml-2 text-gray-500">{hotel.starCategory}</span>
            </div>
            <p className="text-gray-600 mt-1">{hotel.price}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Listhotel;
