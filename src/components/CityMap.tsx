import React, { useEffect, useRef } from 'react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCcYX4UOrbhGNJRCFxhFsGPkQj4C_qPnFY';
const CITY_CENTER = { lat: 12.9141, lng: 77.6460 };
const CUSTOM_PIN_ICON_URL = '/placeholder.svg';

const CityMap = ({ className }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstance.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!mapRef.current) return;
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: CITY_CENTER,
        zoom: 15,
        disableDefaultUI: true,
      });

      new window.google.maps.Marker({
        position: CITY_CENTER,
        map: mapInstance.current,
        title: 'HSR Layout Center',
        icon: {
          url: CUSTOM_PIN_ICON_URL,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      new window.google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        map: mapInstance.current,
        center: CITY_CENTER,
        radius: 500, // meters
      });
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
    </div>
  );
};

export default CityMap;