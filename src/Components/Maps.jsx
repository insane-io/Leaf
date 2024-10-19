import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = 'pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g';

function Map() {
  const [lat, setLat] = useState()
  const [lon, setLon] = useState()
  const [facilities, setFacilities] = useState([
      { id: 1, location: [72.83627602340445,18.959732630284932] },
      { id: 2, location: [73.83627602340445,19.959732630284932] },
      { id: 3, location: [72.93627602340445,18.959732630284932] }
  ])

  useEffect(()=>{    
      async function getdata(){
          try{
              if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition((position) => {
                  setLat(position.coords.latitude)
                  setLon(position.coords.longitude)
                })
              }
          }catch(err){
              console.log(err.message)
          }
      }
      getdata();
  },[])

  useEffect(() => {
    if (lat !== undefined && lon !== undefined) {
      const map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/light-v11',
        center: [lon, lat],
        zoom: 4.5,
        container: 'map',
        antialias: true
      });

      map.on('load', () => {
        const layers = map.getStyle().layers;
        const labelLayerId = layers.find(
          (layer) => layer.type === 'symbol' && layer.layout['text-field']
        ).id;
        
        facilities.forEach(facility => {
          const distance = calculateDistance(lat, lon, facility.location[1], facility.location[0]);
          if (distance <= 5) {
            new mapboxgl.Marker({
              draggable: false
            })
              .setLngLat(facility.location)
              .setPopup(new mapboxgl.Popup().setHTML('<p style="margin:5px">E-facility!</p>'))
              .addTo(map);
          }
        });

        new mapboxgl.Marker({
          draggable: false,
          color: 'red'
        })
        .setLngLat([lon, lat]) 
        .setPopup(new mapboxgl.Popup().setHTML('<p style="margin:5px">My Location</p>')) 
        .addTo(map);
        
        map.addLayer(
          {
            id: 'add-3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
              'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );

        function calculateDistance(lat1, lon1, lat2, lon2) {
          const R = 6371; // Radius of the earth in km
          const dLat = deg2rad(lat2 - lat1);  // deg2rad below
          const dLon = deg2rad(lon2 - lon1);
          const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ; 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          const d = R * c; // Distance in km
          return d;
        }

        function deg2rad(deg) {
          return deg * (Math.PI/180)
        }
      });

      // Cleanup map when component is unmounted
      return () => {
        if (map) {
          map.remove();
        }
      };
    }
  }, [lat, lon]);

  return (
    <>
    <div className='d-flex justify-content-center mt-10'>
      <style>{`
        .mapBox {
          width: 95%; /* Adjust the width for responsiveness */
          height: 40vh; /* Adjust the height for responsiveness */
          // margin: 1rem; /* Adjust the margin for spacing */
          border-radius:1rem;
          border: 1px solid rgba(0,0,0,0.5)
        }

        @media (max-width: 768px) {
          .mapBox {
            width: 90%;
            height: 30vh;
            border-radius:1rem;
          }
        }
      `}</style>
      <div id='map' className='mapBox' />
    </div>
    </>
  );
}

export default Map;
