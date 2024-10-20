import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import CreateAxiosInstance from "../Axios";

mapboxgl.accessToken = 'pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g';

function NewMaps({ data, onCoordinateSelect, handleDestination}) {
  const axiosInstance = CreateAxiosInstance();
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);

  const transportConfig = {
    Car: { icon: '🚗', lineColor: '#3498db', dashArray: [1] },
    Train: { icon: '🚂', lineColor: '#2ecc71', dashArray: [1] },
    Bus: { icon: '🚌', lineColor: '#f1c40f', dashArray: [1] },
    Plane: { icon: '✈️', lineColor: '#f1c40f', dashArray: [1] }
  };

  useEffect(() => {
    // Initialize map
    const newMap = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v11',
      center: [72.8777, 19.076], // Default center (Mumbai)
      zoom: 5,
      container: 'map',
      antialias: true
    });

    setMap(newMap);

    // Load the map and add markers/routes if data exists
    newMap.on('load', () => {
      if (!data || !data.latitude_longitude) return;

      const cityArray = Object.values(data.latitude_longitude);
      const transport = transportConfig[data.vehicle] || transportConfig['Car'];

      cityArray.forEach((city, index) => {
        const color = index === 0 ? '#00ff00' : index === cityArray.length - 1 ? '#ff0000' : '#ffa500';

        const markerElement = document.createElement('div');
        markerElement.className = 'marker';
        markerElement.style.backgroundColor = color;
        markerElement.style.width = '20px';
        markerElement.style.height = '20px';
        markerElement.style.borderRadius = '50%';

        const formData = new FormData();
        formData.append('latitude', city.latitude);
        formData.append('longitude', city.longitude);

        markerElement.addEventListener('click', async () => {
          setSelectedCoordinates({ latitude: city.latitude, longitude: city.longitude });
          onCoordinateSelect?.({ latitude: city.latitude, longitude: city.longitude });

          try {
            const res = await axiosInstance.post('get_near_by_destination/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            });

            if (Array.isArray(res.data)) {
              res.data.forEach((data1) => {
                console.log(data1.longitude, data1.latitude)
                // Create a new marker for each destination
                const newMarkerElement = document.createElement('div');
                newMarkerElement.className = 'marker';
                newMarkerElement.style.backgroundColor = '#ffa500';
                newMarkerElement.style.width = '20px';
                newMarkerElement.style.height = '20px';
                newMarkerElement.style.borderRadius = '50%';
                
                newMarkerElement.addEventListener('click', () => {
                    // Update state with the data of the clicked marker
                    setSelectedMarkerData(data1);
                    handleDestination(data1)
                    console.log("success")
                  });
                new mapboxgl.Marker(newMarkerElement)
                  .setLngLat([data1.longitude, data1.latitude])
                  .setPopup(
                    new mapboxgl.Popup().setHTML(`
                      <div style="padding: 10px;">
                        <h3 style="margin: 0;">${data1.name}</h3>
                      </div>
                    `)
                  )
                  .addTo(newMap);
              });
            } else {
              console.error('Unexpected data format. Expected an array.');
            }
          } catch (error) {
            console.error('Error fetching nearby destinations:', error);
          }
        });

        new mapboxgl.Marker(markerElement)
          .setLngLat([city.longitude, city.latitude])
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div style="padding: 10px;">
                <h3 style="margin: 0;">City ${index + 1}</h3>
                <p style="margin: 5px 0 0 0;">
                  ${index === 0 ? 'Starting Point' : index === cityArray.length - 1 ? 'End Point' : 'Waypoint'}
                </p>
              </div>
            `)
          )
          .addTo(newMap);
      });

      // Adding a route line
      newMap.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: cityArray.map(city => [city.longitude, city.latitude])
          }
        }
      });

      newMap.addLayer({
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

      // Adding transport icon marker at midpoint
      const midIndex = Math.floor(cityArray.length / 2);
      const midpoint = [cityArray[midIndex].longitude, cityArray[midIndex].latitude];

      const el = document.createElement('div');
      el.className = 'transport-marker';
      el.innerHTML = transport.icon;

      new mapboxgl.Marker(el)
        .setLngLat(midpoint)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div style="padding: 10px;">
              <h3 style="margin: 0;">Route Info</h3>
              <p style="margin: 5px 0;">Transport: ${data.vehicle}</p>
              <p style="margin: 5px 0;">Distance: ${data.distance}</p>
              <p style="margin: 5px 0;">Emissions: ${data.carbon_emission}</p>
            </div>
          `)
        )
        .addTo(newMap);

      // Fit map to bounds
      const bounds = new mapboxgl.LngLatBounds();
      cityArray.forEach(city => bounds.extend([city.longitude, city.latitude]));
      newMap.fitBounds(bounds, { padding: 50 });
    });

    return () => newMap.remove(); // Cleanup on component unmount
  }, [data, axiosInstance, onCoordinateSelect]);

  return (
    <div className="d-flex justify-content-center">
      <style>{`
        .mapBox {
          width: 100%;
          height: 90vh;
          border-radius: 1rem;
          border: 1px solid rgba(0,0,0,0.5);
        }

        .marker {
          cursor: pointer;
          background-color: #f00;
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
      {selectedCoordinates && (
        <div className="selected-coordinates">
        </div>
      )}
    </div>
  );
}

export default NewMaps;
