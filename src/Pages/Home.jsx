

import { FaMapMarkerAlt, FaRoute, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const hotels = [
    {
      id: 1,
      name: 'Green Hotel',
      description: 'Certified eco-friendly with carbon offset options.',
      img: 'https://img.freepik.com/free-photo/outdoor-sky-luxury-house-pool_1203-4645.jpg?semt=ais_hybridy',
      details: 'Enjoy a luxurious stay with sustainable practices and green amenities.'
    },
    {
      id: 2,
      name: 'Eco Lodge',
      description: 'Experience nature while reducing your carbon footprint.',
      img: 'https://img.freepik.com/free-photo/view-luxurious-villa-with-modern-architectural-design_23-2151694019.jpg?semt=ais_hybrid',
      details: 'Relax in eco-friendly cabins surrounded by beautiful scenery.'
    },
    {
      id: 3,
      name: 'Sustainable Stay',
      description: 'Your comfort, our commitment to the planet.',
      img: 'https://img.freepik.com/free-photo/view-city-with-apartment-buildings-green-vegetation_23-2150439355.jpg?semt=ais_hybrid',
      details: 'Indulge in modern comfort with an eco-friendly twist.'
    },
    {
      id: 4,
      name: 'Green Retreat',
      description: 'An escape that cares for the Earth.',
      img: 'https://img.freepik.com/free-photo/full-shot-women-meditating-outdoors_23-2149698181.jpg?semt=ais_hybrid',
      details: 'Immerse yourself in tranquility with eco-conscious practices.'
    },
    {
      id: 5,
      name: 'Nature Inn',
      description: 'A perfect blend of nature and luxury.',
      img: 'https://img.freepik.com/free-photo/view-luxurious-villa-with-modern-architectural-design_23-2151694014.jpg?ga=GA1.1.79250162.1729396100&semt=ais_hybrid',
      details: 'Enjoy nature trails and organic meals in a serene setting.'
    },
    {
      id: 6,
      name: 'Eco Paradise',
      description: 'Where luxury meets sustainability.',
      img: 'https://img.freepik.com/free-photo/beautiful-view-wooden-huts-ocean-captured-thailand_181624-13914.jpg?ga=GA1.1.79250162.1729396100&semt=ais_hybrid',
      details: 'Stay in style while supporting eco-friendly initiatives.'
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3; // Number of cards to display at once
  const carouselRef = useRef(null);
  const dragControls = useDragControls();

  const handleDrag = (event, info) => {
    const offset = info.offset.x;

    // Move to the next group of cards when dragged left
    if (offset < -100) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, hotels.length - itemsToShow));
    }
    // Move to the previous group of cards when dragged right
    else if (offset > 100) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };
  return (
    <>
      <div
        className="bg-[#008370] h-[500px] w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://img.freepik.com/free-photo/nature-sea-landscape-with-idyllic-view-water_23-2151358817.jpg?semt=ais_hybrid')", // Replace with your image URL
        }}
      >
        <div className="flex flex-col items-center justify-center mt-6 w-auto h-full">
          <h1 className="text-6xl font-bold text-white mb-4">Welcome to Leaves</h1>
          <h2 className="text-xl font-light text-white ">
            Step Into the Green, Leave Stress Behind
          </h2>

          {/* Search Bar */}
          <div className="w-full max-w-6xl mt-24 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-white p-2 rounded-lg shadow-lg">
            {/* Source Input */}
            <div className="flex items-center flex-1   rounded-lg p-1">
              <FaMapMarkerAlt className="text-gray-500 ml-2" />
              <input
                type="text"
                placeholder="Source"
                className="flex-1 p-1 focus:outline-none ml-2"
              />
            </div>
            {/* Destination Input */}
            <div className="flex items-center flex-1  rounded-lg p-1">
              <FaRoute className="text-gray-500 ml-2" />
              <input
                type="text"
                placeholder="Destination"
                className="flex-1 p-1 focus:outline-none ml-2"
              />
            </div>
            {/* Date Picker Input */}
            <div className="flex items-center flex-1 border border-gray-300 rounded-lg p-1">
              <FaCalendarAlt className="text-gray-500 ml-2" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="When"
                className="flex-1 p-1 focus:outline-none ml-2"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            {/* Search Button */}
            <button className="p-2 bg-[#008370] text-white font-bold rounded-lg w-full md:w-auto">
              Search
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-24">
          {/* Left Column */}
          <div className="col-span-1 flex items-center justify-center">
            {/* Placeholder for an image or icon */}
            <img src="https://img.freepik.com/free-photo/hand-having-magnifying-glass-close-up_23-2148925822.jpg?semt=ais_hybrid" alt="Eco-Friendly" className="w-3/4 h-auto rounded-xl shadow-lg" />
          </div>

          {/* Right Column */}
          <div className="col-span-2 flex flex-col items-start justify-start">
            <h1 className="text-7xl font-bold mb-4">Explore the World, Sustainably</h1>
            <p className="text-lg text-gray-700 mb-6">
              Plan and book eco-friendly travel experiences without compromising on convenience or adventure.
            </p>
            <button className="bg-[#008370] text-white py-2 px-6 rounded-full text-lg font-semibold">Plan Your Trip</button>
          </div>
        </div>
        <div className='mt-16 bg-gray-300 m-24 rounded-2xl  '>
          <section id="calculator" className="pt-16 pb-7 text-center">
            <h2 className="text-5xl font-bold text-gray-500 mb-4">Calculate Your Travel Carbon Footprint</h2>
            <p className="mb-8 text-gray-600">Calculate the environmental impact of your travel choices and explore greener alternatives.</p>
            <button className="bg-[#EFCA10] text-white py-2 px-6 rounded-full">Try Now</button>
          </section>
        </div>
        <div>
          <section id="accommodations" className="bg-[#008370] py-16 text-center text-white">
            <h2 className="text-6xl font-bold mb-4 ">Eco-Friendly Accommodations</h2>
            <p className="mb-8 ">Stay at hotels, resorts, and homestays committed to sustainability.</p>
            <div className="relative">
      <div className="flex overflow-hidden">
        <motion.div
          ref={carouselRef}
          className="flex transition-transform duration-300"
          drag="x"
          dragConstraints={{ left: -((hotels.length - itemsToShow) * 100) + "%", right: 0 }}
          dragElastic={1}
          dragMomentum={false}
          onDragEnd={handleDrag}
          style={{ transform: `translateX(-${(currentIndex / itemsToShow) * 100}%)` }}
        >
          {hotels.map((hotel) => (
            <motion.div
              key={hotel.id}
              className="bg-cover bg-center h-96 w-80 m-2 rounded-lg overflow-hidden"
              style={{ backgroundImage: `url(${hotel.img})` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }} // Scale effect on hover
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-3xl font-semibold">{hotel.name}</h3>
                <p className="text-gray-300">{hotel.description}</p>
                <button className="mt-4 bg-[#008370] text-white py-2 px-4 rounded-full">Learn More</button>
                {/* Show hotel details on hover */}
                <p className="mt-2">{hotel.details}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
          </section>

        </div>


      </div>

    </>
  )
}

export default Home