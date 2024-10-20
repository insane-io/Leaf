import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa'; // Using Font Awesome for star icons
import "react-datepicker/dist/react-datepicker.css";

export const Modal = ({ handleCloseModal, modalContent, showModal }) => {
    const [content, setContent] = useState(modalContent);
    const [rating, setRating] = useState(0); // State for star rating
    const [hover, setHover] = useState(null); // State for hover effect on stars

    useEffect(() => {
        setContent(modalContent);
    }, [modalContent]);

    const handleClose = () => {
        // Trigger exit animation before removing modal
        handleCloseModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add the logic to handle review submission (e.g., API call)
        console.log('Rating:', rating);
        console.log('Review:', content);
        handleCloseModal();
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    id="review-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-opacity-50 bg-black"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-3xl border-[#FF6B66] border">
                            <div className="p-4 md:p-5 space-y-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src="profile1.jpg"
                                                alt="Profile 1"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <p className="ml-2 text-3xl font-bold text-[#FF6B66]">Profile 1 Name</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Rating:
                                        </label>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((star, index) => {
                                                const currentRating = index + 1;
                                                return (
                                                    <label key={index}>
                                                        <input
                                                            type="radio"
                                                            name="rating"
                                                            className="hidden"
                                                            value={currentRating}
                                                            onClick={() => setRating(currentRating)}
                                                        />
                                                        <FaStar
                                                            size={30}
                                                            className="cursor-pointer"
                                                            color={currentRating <= (hover || rating) ? "#FF6B66" : "#ccc"}
                                                            onMouseEnter={() => setHover(currentRating)}
                                                            onMouseLeave={() => setHover(null)}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="review"
                                            name="review"
                                            placeholder="Write your review..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows="4"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="submit"
                                            className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-2.5 bg-[#FF6B66]"
                                        >
                                            Submit Review
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            type="button"
                                            className="ml-4 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-2.5 bg-gray-500"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
