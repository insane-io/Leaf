import React, { useEffect, useState } from 'react';
import Carousal from "../Components/Carousal";
import CreateAxiosInstance from "../Axios";
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Reviews from '../Components/Reviews';

const Places = () => {
  const axiosInstance = CreateAxiosInstance();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonText, setButtonText] = useState('Book Hotel');
  const [buttonColor, setButtonColor] = useState('bg-blue-500');
  const { id } = useParams();
  const [startDate, setStartDate] = useState();
  const [payid, setpayid] = useState();

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axiosInstance.get(`get_or_filter_places/?id=${id}`);
        setPlace(response.data);
        setLoading(false);
        console.log("res", response.data);
      } catch (error) {
        console.error('Error fetching place data:', error);
        setLoading(false);
      }
    }

    fetchPlace();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!place) {
    return <div>Place not found</div>;
  }

  let images = [];
  try {
    if (place.images && typeof place.images === 'string') {
      const formattedImages = place.images.replace(/'/g, '"');
      images = JSON.parse(formattedImages);
    }
  } catch (error) {
    console.error('Error parsing images:', error);
    images = [];
  }

  const handleBooking = () => {
    setButtonText('Booked Successfully');
    setButtonColor('bg-green-500');
  };

  const handlePay = () => {
    async function book(data) {
      try {
        const formData = new FormData();
        formData.append('carbon_footprint', 200);
        formData.append('price', place.price_range);
        formData.append('place_id', id);
        formData.append('payment_id', data);
  
        const res = await axiosInstance.post('create_booking/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  
    const amountInPaise = place.price_range * 100;
  
    const options = {
      key: 'rzp_test_g1hNEV9xyquwrL',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Green Donation',
      handler: (response) => {
        console.log('Payment Response:', response);
        setpayid(response);
        book(response.razorpay_payment_id);
      },
      prefill: {
        name: 'Your Name',
        email: 'email@example.com',
        contact: '1234567890',
      },
      theme: {
        color: '#3399cc',
      },
    };
  
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };
  

  return (
    <div className='mx-72 mt-[3rem]'>
      <Carousal images={images} />
      <div className='flex justify-between mt-16'>
        <h1 className='text-4xl font-semibold my-3'>{place.name}</h1>
        <div className='flex flex-col items-end'>
          <h1 className='text-2xl font-bold mb-3'>Price: {place.price_range}</h1>
          <div className='flex gap-4'>
            <DatePicker selected={startDate} className='border-2 p-3' placeholderText='Enter Date for booking' onChange={(date) => setStartDate(date)} />
            <button
              onClick={handlePay}
              className={`${buttonColor} text-white bg-[#088474] font-bold py-2 px-4 rounded`}
            >
              {buttonText}
            </button>
          </div>
          <h1 className='text-lg'>Rating: {place.rating}</h1>
        </div>
      </div>
      <h1 className='text-xl'>{place.description}</h1>
      <div className='mt-4'>
        <h2 className='text-2xl font-medium'>Price Range: {place.price_range || 'N/A'}</h2>
      </div>

      {/* Badge Display */}
      <h1 className='text-2xl font-medium mt-6'>Certified by</h1>
      {place.badge && (
        <div className='mt-4 flex items-center space-x-4'>
          <img
            src={place.badge.photo}
            alt={place.badge.title}
            className='w-20 h-20 rounded-full'
          />
          <h3 className='text-lg font-medium'>{place.badge.title}</h3>
        </div>
      )}

      <div className='flex space-x-4 mt-6'>
        {place.certifications && place.certifications.map((certification) => (
          <div key={certification.name} className='flex flex-col items-center'>
            <img
              src={certification.imageUrl}
              alt={certification.name}
              className='w-16 h-16 rounded-full'
            />
            <span className='mt-2 text-center'>{certification.name}</span>
          </div>
        ))}
      </div>

      <div className='mt-6'>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-medium mb-4'>Reviews:</h2>
          <button className='bg-[#088474] rounded-xl p-3 text-white'>Add Review</button>
        </div>
        {place.reviews && place.reviews.length > 0 ? (
          <Reviews reviews={place.reviews} />
        ) : (
          <p>No reviews available for this place.</p>
        )}
      </div>
      <div className='mt-8 flex justify-center'></div>
    </div>
  );
};

export default Places;
