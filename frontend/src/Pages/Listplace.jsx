import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const Listplace = () => {

  const [data, setdata] = useState([])
  const [images, setImages] = useState()
  const navigate = useNavigate()
  const location = useLocation();
  const value = location.state?.filter?.value;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://192.168.0.103:8000/get_or_filter_places/?city=${value}`);
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
        
        setdata(formattedPlaces);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  console.log(data)
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 m-[4rem]">
        {data.map((place) => (
          <div className='flex flex-col'>
                      <motion.div
            key={place.id}
            className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/place/${place.id}`)}
          >
            <img
              src={`${place.images[0]}`}
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
          <h1 className='flex p-2 items-center justify-center text-xl'>{place.name}</h1>
          </div>

        ))}
      </div>
    </div>
  )
}

export default Listplace