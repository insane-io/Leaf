import React, { useState } from "react"
import Maps from "../Components/Maps"
import CreateaxiosInstance from "../Axios"

const RouteSearch = () => {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [maps, setMaps] = useState()
  const [data, setData] = useState(
    {
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
  }
  )

  const axiosInstance = CreateaxiosInstance();

  const handleClick = (i) => {
    setMaps(data.routes[i])
  }

  const handleSearch = async () => {
    console.log("Source:", source, "Destination:", destination);
    try {
      const formData = new FormData();
      formData.append("current_location", source)
      formData.append("destination", destination)
      const res = await axiosInstance.post('/calculate-carbon-emissions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data)
      setData(res.data)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 mx-auto rounded-lg space-y-4 mt-10">
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
      <Maps data={maps} />

      {data && data.routes && data.routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {data.routes.map((route, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Route {index + 1}</h3>
                <p className="text-gray-700">
                  <span className="font-medium">Path:</span> {route.route.replace('- ', '')}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Distance:</span> {route.distance}
                  </p>
                  <p>
                    <span className="font-medium">Vehicle:</span> {route.vehicle}
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
  );
};

export default RouteSearch;