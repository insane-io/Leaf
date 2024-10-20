import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../Context/MyContext';
import CreateAxiosInstance from '../Axios';
import { IoWalletOutline } from "react-icons/io5";

const Profile = () => {
    const { setLogin } = useContext(MyContext);
    const axiosInstance = CreateAxiosInstance();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [profile, setProfile] = useState({});

    const [done, setDone] = useState([])
    const getTransactionColor = (type) => {
        switch (type) {
            case '0': return 'bg-red-200'; // Debit
            case '1': return 'bg-green-200'; // Credit
            case '2': return 'bg-yellow-200'; // Donation
            default: return 'bg-gray-200';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, transactionRes, bookingRes] = await Promise.all([
                    axiosInstance.get("profile/"),
                    axiosInstance.get("get_transaction/"),
                    axiosInstance.get("booking_list/")
                ]);
                setProfile(profileRes.data);
                setTransactions(transactionRes.data);
                
                // Format the bookings data, similar to how you did in the places fetching
                const formattedBookings = bookingRes.data.map((booking) => {
                    let imagesArray;
                    try {
                        // Parse the images array, replacing single quotes with double quotes for valid JSON
                        imagesArray = JSON.parse(booking.place.images.replace(/'/g, '"'));
                    } catch (error) {
                        console.error('Error parsing images:', error);
                        imagesArray = [];
                    }

                    return {
                        ...booking,
                        images: Array.isArray(imagesArray) ? imagesArray : [imagesArray],
                    };
                });

                setBookings(formattedBookings);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const logOut = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLogin(false);
        navigate("/");
    };

    return (
        <div className='flex flex-col items-center p-7 mt-16'>
            <div className="flex flex-col items-center mb-12">
                <img 
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${profile.first_name}`} 
                    alt="Profile" 
                    className="rounded-full w-42 h-42" 
                />
                <span className="mt-4 text-2xl font-semibold">
                    {profile?.user?.first_name} {profile?.user?.last_name}
                </span>
                <div className='text-4xl flex items-center gap-3 my-4'>
                    <IoWalletOutline /> {profile.credit_coins}
                </div>
                <button 
                    className='mt-3 bg-red-400 px-4 py-2 rounded-xl text-white' 
                    onClick={logOut}
                >
                    Log Out
                </button>
            </div>
            <div className="w-full max-w-screen-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-left text-2xl font-bold text-[#0A9D50]">About Me</h2>
                    </div>
                    <hr className="border-t-[1px] border-gray-300 w-full mb-6" />

                    <div className='sm:px-24'>
                        <div className="grid grid-cols-4 gap-2">
                            <div className='col-span-2'>
                                <h1 className='ps-5 font-semibold'>First Name</h1>
                                <div className="w-full flex items-center ps-3 h-12 border-[2px] border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">
                                    {profile?.user?.first_name}
                                </div>
                            </div>
                            <div className='col-span-2'>
                                <h1 className='ps-5 font-semibold'>Last Name</h1>
                                <div className="w-full flex items-center ps-3 h-12 border-[2px] border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">
                                    {profile?.user?.last_name}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-3">
                            <div className='col-span-5'>
                                <h1 className='ps-5 font-semibold'>Email</h1>
                                <div className="w-full border-[2px] flex items-center ps-3 h-12 border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">
                                    {profile?.user?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="w-full max-w-screen-lg mt-8">
                    <h2 className="text-left text-2xl font-bold text-[#0A9D50]">Transaction History</h2>
                    <hr className="border-t-[1px] border-gray-300 w-full mb-6" />

                    {transactions.map((transaction) => (
                        <div key={transaction.id} className={`p-4 my-2 rounded-lg ${getTransactionColor(transaction.transaction_type)}`}>
                            <div className="flex justify-between">
                                <span className='text-xl font-semibold'>{transaction.description}</span>
                                <span className='text-2xl font-bold text-[#3939ef]'>{transaction.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Balance Before: {transaction.balance_before}</span>
                                <span>Balance After: <super className="font-bold text-2xl text-[#37b135]">{transaction.balance_after}</super></span>
                            </div>
                            <div className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleString()}</div>
                        </div>
                    ))}
                </div>

            {/* Booked Hotels Section */}
            <div className="w-full max-w-screen-lg mt-8">
                <h2 className="text-left text-2xl font-bold text-[#0A9D50] mb-6">Booked Hotels</h2>
                <hr className="border-t-[1px] border-gray-300 w-full mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {bookings.length === 0 ? (
                        <p className="text-gray-500">No booked hotels available.</p>
                    ) : (
                        bookings.map((booking) => {
                            // Use the first image from the images array if available
                            const imageUrl = booking.images.length > 0 ? booking.images[0] : 'default_image_url_here';

                            return (
                                <div 
                                    key={booking.id} 
                                    className="p-4 rounded-lg shadow-md bg-white flex flex-col items-start"
                                >
                                    <img 
                                        src={imageUrl} 
                                        alt={booking.place.name} 
                                        className="w-full h-48 rounded-md object-cover mb-4" 
                                    />
                                    <h3 className="text-lg font-semibold mb-2 text-center">{booking.place.name}</h3>
                                    <p className="text-gray-700 text-center">{booking.place.city}</p>
                                    <p className="text-gray-500">{booking.place.star} Stars</p>
                                    <p className="text-gray-500">Price Range: <super className="font-bold text-[#1fab21]">{booking.place.price_range} </super> </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
