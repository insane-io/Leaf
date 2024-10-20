import React, { useEffect, useState } from 'react'
import Carousal from "../Components/Carousal"
import CreateAxiosInstance from "../Axios"
import { useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import Reviews from '../Components/Reviews'
import { FaStar } from 'react-icons/fa'
import { useTime } from 'framer-motion'


const Places = () => {
  const axiosInstance = CreateAxiosInstance()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [buttonText, setButtonText] = useState('Book Hotel')
  const [buttonColor, setButtonColor] = useState('bg-blue-500')
  const { id } = useParams()
  const [startDate, setStartDate] = useState()
  const [payid, setpayid] = useState()
  const [reviewtext, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [flag, setFlag] = useState(true)
  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axiosInstance.get(`get_or_filter_places/?id=${id}`)
        setPlace(response.data)
        setLoading(false)
        console.log("res", response.data)
      } catch (error) {
        console.error('Error fetching place data:', error)
        setLoading(false)
      }
    }

    fetchPlace()
  }, [flag])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!place) {
    return <div>Place not found</div>
  }

  let images = []
  try {
    if (place.images && typeof place.images === 'string') {
      const formattedImages = place.images.replace(/'/g, '"')
      images = JSON.parse(formattedImages)
    }
  } catch (error) {
    console.error('Error parsing images:', error)
    images = []
  }

  const handleBooking = () => {
    setButtonText('Booked Successfully')
    setButtonColor('bg-green-500')
  }
  const handleReview = () =>{
    try {
      const formData = new FormData()
      formData.append('review', reviewtext)
      formData.append('rating', rating)
      formData.append('place_id', id)
      // formData.append('payment_id', data)

      const res = axiosInstance.post('reviews/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(res)
      setRating(0)
      setReview("")
      setFlag(!flag)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePay = () => {
    async function book(data) {
      try {
        const formData = new FormData()
        formData.append('carbon_footprint', 200)
        formData.append('price', place.price_range)
        formData.append('place_id', id)
        formData.append('payment_id', data)

        const res = await axiosInstance.post('create_booking/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }

    const amountInPaise = place.price_range * 100


    const options = {
      key: 'rzp_test_g1hNEV9xyquwrL',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Green Donation',
      handler: (response) => {
        console.log('Payment Response:', response)
        setpayid(response)
        book(response.razorpay_payment_id)
      },
      prefill: {
        name: 'Your Name',
        email: 'email@example.com',
        contact: '1234567890',
      },
      theme: {
        color: '#3399cc',
      },
    }

    const rzp1 = new window.Razorpay(options)
    rzp1.open()
  }


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
          {/* <button className='bg-[#088474] rounded-xl p-3 text-white'>Add Review</button> */}
        </div>
        {place.reviews && place.reviews.length > 0 ? (
          <Reviews reviews={place.reviews} />
        ) : (
          <p>No reviews available for this place.</p>
        )}
        <div className='flex border rounded p-3 flex-col'>
          <div className='w-full'>
            <input type="text" value={reviewtext} className='h-[10rem] w-full rounded-xl p-3 border-2' onChange={(e) => { setReview(e.target.value) }}>
            </input>
            <div className='flex flex-row'>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1

                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={starValue}
                      onClick={() => setRating(starValue)}
                      style={{ display: 'none' }} // Hide radio buttons
                    />
                    <FaStar
                      size={30}
                      color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(starValue)}
                      style={{ cursor: 'pointer' }}
                    />
                  </label>
                )
              })}
              {/* <p className=''>Your rating: {rating} out of 5</p> */}
            </div>
            <div className='ml-auto w-full mt-3'>
              <button className='bg-[#088474] w-full rounded-xl p-3 text-white' onClick={()=>{handleReview()}}>Submit Review</button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='mt-8 flex justify-center'></div> */}
    </div>
  )
}

export default Places
