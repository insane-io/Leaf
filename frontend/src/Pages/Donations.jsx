import React, { useEffect, useState } from 'react';
import CreateAxiosInstance from '../Axios';

const donationOptions = [
  { id: 1, name: 'Tree Planting', description: 'Plant trees to absorb CO2 and improve air quality.', amount: 20 },
  { id: 2, name: 'Renewable Energy Projects', description: 'Support solar and wind energy initiatives.', amount: 50 },
  { id: 3, name: 'Clean Water Initiatives', description: 'Provide access to clean water and sanitation.', amount: 30 },
  { id: 4, name: 'Sustainable Agriculture', description: 'Help farmers adopt eco-friendly practices.', amount: 40 },
];

const Donations = () => {
  const axiosInstance = CreateAxiosInstance(); // Move axiosInstance creation outside of handleDonate
  const [selectedOption, setSelectedOption] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState();

  useEffect(() => {
    async function getData() {
      try {
        const res = await axiosInstance.get('profile/');
        console.log(res.data);
        setUser(res.data.user.first_name);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [axiosInstance]);

  const handleDonate = async () => {
    if (!selectedOption || !donationAmount) {
      alert('Please select a donation option and enter an amount.');
      return;
    }
  
    const options = {
      key: 'rzp_test_g1hNEV9xyquwrL', 
      amount: (donationAmount * 100).toString(), 
      currency: 'INR',
      name: 'Green Donation',
      description: `Donation for ${selectedOption.name}`,
      handler: async (response) => {
        console.log('Payment Response:', response);
        const paymentId = response.razorpay_payment_id;
        const formData = {
          name: user, // User's name from state
          amount: donationAmount,
          paymentId: paymentId,
          donationType: selectedOption.name,
          message: `Thank you ${user} for your donation of ₹${donationAmount} towards ${selectedOption.name}! Your support helps reduce carbon emissions!`
        };
  
        try {
          // Post the form data to the server
          const res = await axiosInstance.post('donations/', formData);
          console.log('Donation successfully recorded:', res.data);
          setSuccessMessage(formData.message);
        } catch (error) {
          console.error('Error posting donation data:', error);
        }
  
        setDonationAmount('');
        setSelectedOption(null);
      },
      prefill: {
        name: user, // Using the user's name fetched from the profile
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
    <div className="mx-8 my-10">
      <h1 className="text-3xl font-bold mb-6">Make a Green Donation</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Choose Your Donation to Combat Climate Change</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {donationOptions.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer ${selectedOption?.id === option.id ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}
              onClick={() => setSelectedOption(option)}
            >
              <h3 className="text-lg font-medium">{option.name}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
              <p className="font-bold mt-2">Suggested Amount: ₹{option.amount}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="donation-amount" className="block text-lg font-medium mb-2">Enter Your Donation Amount</label>
        <input
          type="number"
          id="donation-amount"
          className="border rounded-lg w-full p-2"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          placeholder="Enter amount in INR"
        />
      </div>
      <button
        onClick={handleDonate}
        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${!selectedOption || !donationAmount ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!selectedOption || !donationAmount}
      >
        Donate
      </button>
      {successMessage && (
        <div className="mt-6 text-green-600 font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Donations;
