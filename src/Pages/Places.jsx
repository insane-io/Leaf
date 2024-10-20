import React, { useEffect, useState } from 'react';
import Carousal from "../Components/Carousal";
import CreateAxiosInstance from "../Axios"; // Import your axios instance function

const Places = () => {
  const axiosInstance = CreateAxiosInstance(); // Create an axios instance
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonText, setButtonText] = useState('Book Hotel'); // State for button text
  const [buttonColor, setButtonColor] = useState('bg-blue-500'); // State for button color

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axiosInstance.get('get_place/?id=3'); // Use axiosInstance to fetch data
        setPlace(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching place data:', error);
        setLoading(false);
      }
    }
    
    fetchPlace();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!place) {
    return <div>Place not found</div>;
  }

  let images = [];
  try {
    // Check if images is a valid string before parsing
    if (place.images && typeof place.images === 'string') {
      // Replace single quotes with double quotes for JSON parsing
      const formattedImages = place.images.replace(/'/g, '"');
      images = JSON.parse(formattedImages);
    }
  } catch (error) {
    console.error('Error parsing images:', error);
    images = []; // Fallback to an empty array if parsing fails
  }

  const handleBooking = () => {
    // Change button text and color on click
    setButtonText('Booked Successfully');
    setButtonColor('bg-green-500'); // Change color to green
  };

  return (
    <div className='mx-72'>
      <Carousal images={images} /> {/* Pass the images to Carousal */}
      <div className='flex justify-between mt-16'>
        <h1 className='text-4xl font-semibold my-3'>{place.name}</h1>
        <h1 className='text-lg'>Rating: {place.rating}</h1>
      </div>
      <h1 className='text-xl'>{place.description}</h1>
      <div className='mt-4'>
        <h2 className='text-2xl font-medium'>Price Range: {place.price_range || 'N/A'}</h2>
      </div>
      {/* Eco-Friendly Certified Badges Section */}
      <div className='flex space-x-4 mt-6'>
        {place.certifications && place.certifications.map((certification) => (
          <div key={certification.name} className='flex flex-col items-center'>
            <img 
              src={certification.imageUrl} 
              alt={certification.name} 
              className='w-16 h-16 rounded-full' // Circular badge style
            />
            <span className='mt-2 text-center'>{certification.name}</span>
          </div>
        ))}
      </div>
      <div className='mt-6'>
        <h2 className='text-2xl font-medium mb-4'>Reviews:</h2>
        {place.reviews && place.reviews.length > 0 ? (
          <ul className='space-y-4'>
            {place.reviews.map((review) => (
              <li key={review.id} className='border p-4 rounded'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold'>Rating: {review.rating}</h3>
                </div>
                <p className='mt-2'>{review.review}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available for this place.</p>
        )}
      </div>
      <div className='mt-8 flex justify-center'>
        <button
          onClick={handleBooking}
          className={`${buttonColor} hover:bg-green-700 text-white font-bold py-2 px-4 rounded`} // Use buttonColor state for button background color
        >
          {buttonText} {/* Use buttonText state for button label */}
        </button>
      </div>
    </div>
  );
};

export default Places;
