import React from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  {
    id: 1,
    personImage: 'https://via.placeholder.com/50', // Placeholder image
    name: 'John Doe',
    description: 'Amazing experience! The place was beautiful and well maintained.',
    rating: 5,
  },
  {
    id: 2,
    personImage: 'https://via.placeholder.com/50', // Placeholder image
    name: 'Jane Smith',
    description: 'Good service and wonderful environment. Highly recommend!',
    rating: 4,
  },
  // Add more reviews as needed
];

const Reviews = () => {
  return (
    <div className="p-6 space-y-4">
      {reviewsData.map((review) => (
        <motion.div
          key={review.id}
          className="flex items-center bg-white shadow-lg rounded-lg p-4"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left - Circular Image */}
          <div className="flex-shrink-0">
            <img
              src={review.personImage}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>

          {/* Middle - Name and Description */}
          <div className="ml-4 flex-grow">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-lg">{review.name}</h4>
              {/* Right - Rating */}
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, index) => (
                  <span key={index} className="text-yellow-500">★</span>
                ))}
                {[...Array(5 - review.rating)].map((_, index) => (
                  <span key={index} className="text-gray-300">★</span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-1">{review.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Reviews;
