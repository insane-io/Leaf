import React, { useState } from "react"
import NewMaps from "../Components/newMaps"
import CreateaxiosInstance from "../Axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Reviews from "../Components/Reviews";
import { useNavigate } from "react-router-dom";
const RouteSearch = () => {
    const navigate = useNavigate();
    const [source, setSource] = useState("")
    const [destination, setDestination] = useState("")
    const [loader, setLoader] = useState(false)
    const [maps, setMaps] = useState({})
    const [data, setData] = useState({})
    const [openbox, setOpenbox] = useState(false)
    const [showhoteldata, setShowHotelData] = useState(false)
    const [hoteldata, setHOtelData] = useState({})
    const transportConfig = {
        Car: { icon: '🚗', lineColor: '#3498db', dashArray: [1] },
        Train: { icon: '🚂', lineColor: '#2ecc71', dashArray: [1] },
        Bus: { icon: '🚌', lineColor: '#f1c40f', dashArray: [1] },
        Plane: { icon: '✈️', lineColor: '#f1c40f', dashArray: [1] }
    };
    const handleGoBack = () => {
        setOpenbox(false)
        setShowHotelData(false)
        setHOtelData({})
    }
    const handleGoBackMain = () => {
        setOpenbox(false)
        setShowHotelData(false)
        setHOtelData({})
    }
    const axiosInstance = CreateaxiosInstance();

    const handleClick = (i) => {
        setMaps(data.routes[i])
        setShowHotelData(false)
        setOpenbox(true)
    }
    const handleDestination = (data) => {
        setOpenbox(true)
        setShowHotelData(true)
        setHOtelData(data)
        console.log(data, "======>")
    }

    const handleSearch = async () => {
        console.log("Source:", source, "Destination:", destination);
        try {
            const formData = new FormData();
            formData.append("current_location", source)
            formData.append("destination", destination)
            setLoader(true)
            const res = await axiosInstance.post('/calculate-carbon-emissions/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(res.data)
            setData(res.data)
            setLoader(false)
        } catch (error) {
            setData({
                "routes": [
                    {
                        "route": "Mumbai-Kota-Delhi",
                        "latitude_longitude": {
                            "City_1": {
                                "latitude": 19.076,
                                "longitude": 72.8777
                            },
                            "City_2": {
                                "latitude": 25.184,
                                "longitude": 75.8304
                            },
                            "City_3": {
                                "latitude": 28.6139,
                                "longitude": 77.209
                            }
                        },
                        "carbon_footprint": "120 kg CO2e",
                        "distance": "1170.0 km",
                        "vehicle": "Train",
                        "estimated_cost": 1755.0,
                        "carbon_emission": "47.97 kg CO2"
                    },
                    {
                        "route": "Mumbai-Ahmedabad-Delhi",
                        "latitude_longitude": {
                            "City_1": {
                                "latitude": 19.076,
                                "longitude": 72.8777
                            },
                            "City_2": {
                                "latitude": 23.0225,
                                "longitude": 72.5714
                            },
                            "City_3": {
                                "latitude": 28.6139,
                                "longitude": 77.209
                            }
                        },
                        "carbon_footprint": "130 kg CO2e",
                        "distance": "1250.0 km",
                        "vehicle": "Bus",
                        "estimated_cost": 1500.0,
                        "carbon_emission": "85.0 kg CO2"
                    },
                    {
                        "route": "Mumbai-Indore-Delhi",
                        "latitude_longitude": {
                            "City_1": {
                                "latitude": 19.076,
                                "longitude": 72.8777
                            },
                            "City_2": {
                                "latitude": 22.7206,
                                "longitude": 75.8765
                            },
                            "City_3": {
                                "latitude": 28.6139,
                                "longitude": 77.209
                            }
                        },
                        "carbon_footprint": "140 kg CO2e",
                        "distance": "1300.0 km",
                        "vehicle": "Car",
                        "estimated_cost": 3900.0,
                        "carbon_emission": "156.0 kg CO2"
                    },
                    {
                        "route": "Mumbai-Surat-Delhi",
                        "latitude_longitude": {
                            "City_1": {
                                "latitude": 19.076,
                                "longitude": 72.8777
                            },
                            "City_2": {
                                "latitude": 21.1702,
                                "longitude": 72.8311
                            },
                            "City_3": {
                                "latitude": 28.6139,
                                "longitude": 77.209
                            }
                        },
                        "carbon_footprint": "150 kg CO2e",
                        "distance": "1350.0 km",
                        "vehicle": "Plane",
                        "estimated_cost": 6750.0,
                        "carbon_emission": "384.75 kg CO2"
                    }
                ]
            })
            setLoader(false)
            console.log(error)
        }
    };

    return (
        <div className="relative w-full mt-[3rem] pl-2 pr-2">
            <style>{`.loader {
            border: 8px solid #f3f3f3; /* Light gray */
            border-top: 8px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`}

            </style>
            <div className="absolute top-0 left-0 bg-white shadow-lg p-3 mx-auto rounded-lg space-y-4 w-3/12 z-10 ml-3 mt-3">
                {!openbox && (<div className="flex flex-col gap-4">
                    <input
                        type="text"
                        className="border-2 rounded-lg p-2 flex-1"
                        placeholder="Source"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                    <input
                        type="text"
                        className="border-2 rounded-lg p-2 flex-1"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                    <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>)}
                {loader && (
                    <div className="loader">

                    </div>

                )}
                {!openbox && (<div className="overflow-y-auto max-h-[32rem]">
                    {data && data.routes && data.routes.length > 0 && !openbox && (
                        <div className="flex flex-col m-1 gap-4">
                            {data.routes.map((route, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(index)}
                                    className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                                >
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-lg">Route {index + 1}</h3>
                                        <h3 className="font-semibold text-lg">
                                            <span className="font-semibold text-lg">Path:</span>
                                            <span className="text-lg">{route.route.replace('- ', '')}</span>
                                        </h3>
                                        <h3>
                                            <span className="font-semibold text-xl">Vehicle:</span>
                                            <span className="font-semibold text-xl">{transportConfig[route.vehicle].icon || transportConfig['Car'].icon} {route.vehicle}</span>
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <p>
                                                <span className="font-medium">Distance:</span> {route.distance}
                                            </p>
                                            <p>
                                                <span className="font-medium">Carbon Footprint:</span> {route.carbon_footprint}
                                            </p>
                                            <p>
                                                <span className="font-medium">Carbon Emission:</span> {route.carbon_emission}
                                            </p>
                                            <p>
                                                <span className="font-medium">Est. Cost:</span> ₹{route.estimated_cost}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                )}
                {openbox && showhoteldata && (<div className="">
                    <button onClick={handleGoBack}>
                        &#8592; Go Back
                    </button>
                    <div style={{ padding: '10px' }} className="overflow-y-auto max-h-[45rem]">
                        <h1 className="text-xl m-2 font-bold">{hoteldata.name}</h1>
                        {/* <App images={JSON.parse(hoteldata.images.replace(/'/g, '"'))}/> */}
                        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                            {
                                JSON.parse(hoteldata.images.replace(/'/g, '"')).map((d) => (
                                    <SwiperSlide><img src={`${d}`} alt="" className='h-[20rem] border rounded-lg w-full' /></SwiperSlide>
                                ))
                            }
                        </Swiper>
                        <p style={{ margin: '5px 0 0 0' }} className="text-lg">{hoteldata.description}</p>
                        <p>
                            <b>City:</b> {hoteldata.city}
                        </p>
                        <p>
                            <b>Country:</b> {hoteldata.country}
                        </p>
                        <p>
                            <b>Rating:</b> {hoteldata.rating}
                        </p>
                        <p>
                            <b>Price Range:</b> {hoteldata.price_range}
                        </p>
                        <p>
                            <b>Phone:</b> {hoteldata.phone_number}
                        </p>
                        {/* <a href={hoteldata.website} target="_blank">Visit Website</a> */}
                        <div className="flex justify-center m-2">
                            <button className="bg-cyan-300 p-3 font-bold text-xl rounded" onClick={()=>{navigate(`/place/${hoteldata.id}`)}
                            }>Click here for Booking</button>
                            </div>
                        <h1 className="text-xl">Reviews</h1>
                        <Reviews reviews={hoteldata.reviews}/>
                    </div>

                </div>)}
                {
                    openbox && !showhoteldata && (<div
                        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50"
                    >
                        <button onClick={handleGoBackMain}>
                            &#8592; Go Back
                        </button>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Route</h3>
                            <p className="text-gray-700">
                                <span className="font-medium">Path:</span> {maps.route.replace('- ', '')}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p>
                                    <span className="font-medium">Distance:</span> {maps.distance}
                                </p>
                                <p>
                                    <span className="font-medium">Vehicle:</span> {maps.vehicle}
                                </p>
                                <p>
                                    <span className="font-medium">Carbon Footprint:</span> {maps.carbon_footprint}
                                </p>
                                <p>
                                    <span className="font-medium">Carbon Emission:</span> {maps.carbon_emission}
                                </p>
                                <p>
                                    <span className="font-medium">Est. Cost:</span> ₹{maps.estimated_cost}
                                </p>
                            </div>
                        </div>
                    </div>)
                }

            </div>
            <NewMaps data={maps} handleDestination={handleDestination} />
        </div>

    );
};

export default RouteSearch;