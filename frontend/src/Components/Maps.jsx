import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import CreateAxiosInstance from "../Axios"

mapboxgl.accessToken = 'pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g';

function Map({ data, onCoordinateSelect }) {

  const axiosInstance = CreateAxiosInstance()
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [map, setMap] = useState(null);

  const transportConfig = {
    Car: { icon: '🚗', lineColor: '#3498db', dashArray: [1] },
    Train: { icon: '🚂', lineColor: '#2ecc71', dashArray: [1] },
    Bus: { icon: '🚌', lineColor: '#f1c40f', dashArray: [1] },
    Plane: { icon: '✈️', lineColor: '#f1c40f', dashArray: [1] }
  };

  useEffect(() => {
    if (!data || !data.latitude_longitude) return;

    const cityArray = Object.values(data.latitude_longitude);
    const transport = transportConfig[data.vehicle] || transportConfig['Car'];

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v11',
      center: cityArray[0] ? [cityArray[0].longitude, cityArray[0].latitude] : [72.8777, 19.076],
      zoom: 5,
      container: 'map',
      antialias: true
    });

    setMap(map);

    map.on('load', () => {
      
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

        markerElement.addEventListener('click', () => {
          setSelectedCoordinates({ latitude: city.latitude, longitude: city.longitude });
          onCoordinateSelect?.({ latitude: city.latitude, longitude: city.longitude });

          const res = axiosInstance.post('get_near_by_destination/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }})
          console.log(res.data)
        }
        );


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
          .addTo(map);
      });


      map.addSource('route', {
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
        .addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      cityArray.forEach(city => bounds.extend([city.longitude, city.latitude]));
      map.fitBounds(bounds, { padding: 50 });
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
          Selected: Lat {selectedCoordinates.latitude}, Lng {selectedCoordinates.longitude}
        </div>
      )}
    </div>
  );
}

export default Map;
