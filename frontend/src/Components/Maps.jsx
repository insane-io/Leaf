import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g';

const routesData = {
  route1: {
    name: 'MumbaiSuratAhmedabadUdaipurJaipurDelhi',
    cities: [
      { name: 'Mumbai', coordinates: [72.8777, 19.076] },
      { name: 'Surat', coordinates: [72.8311, 21.1702] },
      { name: 'Ahmedabad', coordinates: [72.5714, 23.0225] },
      { name: 'Udaipur', coordinates: [73.6967, 24.5854] },
      { name: 'Jaipur', coordinates: [75.7873, 26.9124] },
      { name: 'Delhi', coordinates: [77.2089, 28.6139] }
    ],
    vehicle: 'Train',
    distance: '1350.0 km',
    carbonEmission: '55.35 kg CO2'
  },
  route2: {
    name: 'MumbaiVadodaraKotaAgraDelhi',
    cities: [
      { name: 'Mumbai', coordinates: [72.8777, 19.076] },
      { name: 'Vadodara', coordinates: [73.1812, 22.3039] },
      { name: 'Kota', coordinates: [75.8333, 25.1848] },
      { name: 'Agra', coordinates: [78.0081, 27.1767] },
      { name: 'Delhi', coordinates: [77.2089, 28.6139] }
    ],
    vehicle: 'Train',
    distance: '1280.0 km',
    carbonEmission: '52.48 kg CO2'
  },
  route3: {
    name: 'MumbaiSuratIndoreGwaliorAgraDelhi',
    cities: [
      { name: 'Mumbai', coordinates: [72.8777, 19.076] },
      { name: 'Surat', coordinates: [72.8311, 21.1702] },
      { name: 'Indore', coordinates: [75.8472, 22.7206] },
      { name: 'Gwalior', coordinates: [78.1828, 26.2186] },
      { name: 'Agra', coordinates: [78.0081, 27.1767] },
      { name: 'Delhi', coordinates: [77.2089, 28.6139] }
    ],
    vehicle: 'Car',
    distance: '1400.0 km',
    carbonEmission: '168.0 kg CO2'
  },
  route4: {
    name: 'MumbaiSuratAhmedabadUdaipurKotaAgraDelhi',
    cities: [
      { name: 'Mumbai', coordinates: [72.8777, 19.076] },
      { name: 'Surat', coordinates: [72.8311, 21.1702] },
      { name: 'Ahmedabad', coordinates: [72.5714, 23.0225] },
      { name: 'Udaipur', coordinates: [73.6967, 24.5854] },
      { name: 'Kota', coordinates: [75.8333, 25.1848] },
      { name: 'Agra', coordinates: [78.0081, 27.1767] },
      { name: 'Delhi', coordinates: [77.2089, 28.6139] }
    ],
    vehicle: 'Bus',
    distance: '1450.0 km',
    carbonEmission: '98.6 kg CO2'
  }
};

function Map({ routeId = 'route1', data }) {

  console.log(data)
  const [map, setMap] = useState(null);
  
  const transportConfig = {
    Car: {
      icon: '🚗',
      lineColor: '#3498db',
      dashArray: [1]
    },
    Train: {
      icon: '🚂',
      lineColor: '#2ecc71',
      dashArray: [1]
    },
    Bus: {
      icon: '🚌',
      lineColor: '#f1c40f',
      dashArray: [1]
    }
  };

  const defaultLatitude = 19.076; 
  const defaultLongitude = 72.8777;

  useEffect(() => {

    console.log(data)
    const routeData = routesData[routeId];
    const { cities, vehicle } = routeData
    const transport = transportConfig[vehicle]  

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v11',
      center: cities[0]?.coordinates,
      zoom: 5,
      container: 'map',
      antialias: true
    });

    setMap(map);
    console.log("hello111");
    map.on('load', () => {
      const cityArray = Array.isArray(data.latitude_longitude) ? data.latitude_longitude : Object.values(data.latitude_longitude)
      console.log("array",data)
      cityArray.map((city, index) => {
        const latitude = city?.latitude || defaultLatitude;
        const longitude = city?.longitude || defaultLongitude;
        console.log("lat ", latitude, longitude);
        const color = index === 0 ? '#00ff00' :
          index === cities.length - 1 ? '#ff0000' : '#ffa500';

        new mapboxgl.Marker({ color })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0;">${city.name}</h3>
                <p style="margin: 5px 0 0 0;">
                  ${index === 0 ?
                    'Starting Point' :
                    index === cities.length - 1 ? 'End Point' : 'Waypoint'}
                </p>
              </div>
            `)
          )
          .addTo(map);
      });
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: cityArray.map(city => city.coordinates)
          }
        }
      });

      // Add the line layer
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': transport.lineColor,
          'line-width': 4,
          'line-dasharray': transport.dashArray
        }
      });

      // Add transport mode indicator at the middle point
      const midIndex = Math.floor(cities.length / 2);
      const midpoint = cities[midIndex].coordinates;

      const el = document.createElement('div');
      el.className = 'transport-marker';
      el.innerHTML = transport.icon;

      new mapboxgl.Marker(el)
        .setLngLat(midpoint)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0;">Route Info</h3>
              <p style="margin: 5px 0;">Transport: ${vehicle}</p>
              <p style="margin: 5px 0;">Distance: ${routeData.distance}</p>
              <p style="margin: 5px 0;">Emissions: ${routeData.carbonEmission}</p>
            </div>
          `)
        )
        .addTo(map);
      const bounds = new mapboxgl.LngLatBounds();
      cities.forEach(city => bounds.extend(city.coordinates));

      map.fitBounds(bounds, {
        padding: 50
      });
    });

    return () => map.remove();
  }, [data]);

  return (
    <div className="d-flex justify-content-center">
      <style>{`
        .mapBox {
          width: 100%;
          height: 40vh;
          border-radius: 1rem;
          border: 1px solid rgba(0,0,0,0.5);
        }

        .transport-marker {
          cursor: pointer;
          font-size: 24px;
          text-align: center;
          background-color: white;
          border-radius: 3px;
          padding: 5px;
          border: 1px solid rgba(0, 0, 0, 0.3);
        }
      `}</style>
      <div id="map" className="mapBox" />
    </div>
  );
}

export default Map;
