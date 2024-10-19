import React, { useEffect, useState } from 'react';
import { MdFlight } from "react-icons/md";
import { FaCarAlt } from "react-icons/fa";
import { FaTrain } from "react-icons/fa";
import axios from 'axios';

function CarbonFootprintCalculator() {
  const [tripType, setTripType] = useState('flight');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [roundTrip, setRoundTrip] = useState(true);
  const [emission, setEmission] = useState(null);

  const emissionFactors = {
    flight: 0.158,
    car: 0.120,
    train: 0.041
  };

  useEffect(() => {
    setEmission(null)
  }, [tripType])

  const mapboxToken = 'pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g';

  const getCoordinates = async (location) => {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${mapboxToken}`
    );
    const [longitude, latitude] = response.data.features[0].center;
    console.log(response.data.features[0].center)
    return { latitude, longitude };
  };

  const getDistance = async () => {
    try {
      const sourceCoords = await getCoordinates(source);
      const destinationCoords = await getCoordinates(destination);

      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${sourceCoords.longitude},${sourceCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}.json?access_token=${mapboxToken}&geometries=geojson`
      );

      const distanceInMeters = response.data.routes[0].distance;
      const distanceInKm = distanceInMeters / 1000;
      console.log(distanceInKm);

      return distanceInKm;
    } catch (error) {
      console.error('Error fetching distance:', error);
      return null;
    }
  };

  const calculateFootprint = async () => {
    const distanceInKm = await getDistance();
  
    if (distanceInKm) {
      const factor = emissionFactors[tripType];
      let totalDistance = distanceInKm;
  
      if (roundTrip) {
        totalDistance *= 2;
      }
  
      const totalEmission = totalDistance * factor * passengers;
      setEmission(`${totalEmission.toFixed(2)} Kg CO2`);
    } else {
      // Set an error message if distance calculation fails
      setEmission("Please enter valid locations");
    }
  };
  

  return (
    <div className="col-span-1 mx-auto p-4 bg-white border-2 border-gray-400 rounded-lg">
      <header className="text-center ">
        <h1 className="text-2xl font-semibold text-gray-800">Calculate Your Travel Carbon Footprint</h1>
        <p className="text-gray-600 mt-2 text-lg">Use our carbon footprint calculator to calculate your travel emissions</p>
      </header>
      <div className='flex flex-col'>
        <div className="bg-white p-6 rounded-lg">
          <div className="flex justify-center w-full mb-6">
            <button
              className={`px-4 py-2 w-full flex items-center justify-center rounded-md ${tripType === 'flight' ? 'bg-[#d6ebe8] border-2 border-[#008370] text-[#008370]' : 'border-2 text-gray-700'}`}
              onClick={() => setTripType('flight')}
            >
              <MdFlight /> Flight
            </button>
            <button
              className={`px-4 py-2 w-full flex items-center justify-center rounded-md ${tripType === 'car' ? 'bg-[#d6ebe8] border-2 border-[#008370] text-[#008370]' : 'border-2 text-gray-700'}`}
              onClick={() => setTripType('car')}
            >
              <FaCarAlt /> Car
            </button>
            <button
              className={`px-4 py-2 w-full flex items-center justify-center rounded-md ${tripType === 'train' ? 'bg-[#d6ebe8] border-2 border-[#008370] text-[#008370]' : 'border-2 text-gray-700'}`}
              onClick={() => setTripType('train')}
            >
              <FaTrain /> Train
            </button>
          </div>
          <form className="space-y-4">
            <div className="flex gap-x-7 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="trip"
                  className="mr-2 size-4"
                  checked={roundTrip}
                  onChange={() => setRoundTrip(true)}
                />
                Round Trip
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="trip"
                  className="mr-2 size-4"
                  onChange={() => setRoundTrip(false)}
                />
                One Way
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Where From?</label>
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter departure city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Where To?</label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  placeholder="Enter destination city"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={calculateFootprint}
                className="bg-[#008370] text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600"
              >
                Calculate
              </button>
            </div>
          </form>
        </div>
        <div className="p-6 rounded-lg text-center">
          {emission && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Your Carbon Footprint</h2>
              <p className="text-gray-700 text2xl font-semibold">{emission}</p>
            </>
          )
          }
        </div>
      </div>
    </div>
  );
}

export default CarbonFootprintCalculator;
