import React from 'react';
import { motion } from 'framer-motion';

const Reviews = ({ reviews }) => {
  return (
    <div className="p-6 space-y-4">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <motion.div
            key={review.id}
            className="flex items-center bg-white shadow-lg rounded-lg p-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Left - Circular Image */}
            <div className="flex-shrink-0">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${review?.user?.user.first_name}`}
                alt={review.user?.first_name || 'Anonymous'}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Middle - Name and Description */}
            <div className="ml-4 flex-grow">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg">{review.user?.user?.first_name || 'Anonymous'}</h4>
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
              <p className="text-gray-600 mt-1">{review.review || 'No description provided.'}</p>
            </div>
          </motion.div>
        ))
      ) : (
        <p>No reviews available for this place.</p>
      )}
    </div>
  );
};

export default Reviews;
