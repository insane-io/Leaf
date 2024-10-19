import React from 'react';
import { motion } from 'framer-motion';

const tourGuides = [
    { name: 'John Doe', location: 'New York, USA', rating: 4.8, image: 'https://via.placeholder.com/150' },
    { name: 'Jane Smith', location: 'Paris, France', rating: 4.9, image: 'https://via.placeholder.com/150' },
    { name: 'Liam Brown', location: 'Sydney, Australia', rating: 4.7, image: 'https://via.placeholder.com/150' },
    { name: 'Emily White', location: 'Tokyo, Japan', rating: 4.9, image: 'https://via.placeholder.com/150' },
];

const TourGuider = () => {
    return (
        <div className=" bg-gray-100 flex flex-col px-10 p-3">
            <h1 className="text-3xl font-bold mb-6">Top Tour Guides</h1>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tourGuides.map((guide, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-lg p-4 flex flex-col items-center border border-transparent shadow-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{
                            scale: 1.05,
                            borderColor: '#4f46e5', // Indigo-600
                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                        }}
                    >
                        <div className=' grid grid-cols-3'>
                            <div className='col-span-1'>
                                <img
                                    src={guide.image}
                                    alt={guide.name}
                                    className=" h-56 object-cover"
                                />
                            </div>
                            <div className=' col-span-2 px-5'>
                            <h2 className="text-5xl font-semibold">{guide.name}</h2>
                        
                        <p className="text-yellow-500 font-bold">Rating: {guide.rating} ⭐</p>
                            </div>
                        </div>
                        
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TourGuider;
