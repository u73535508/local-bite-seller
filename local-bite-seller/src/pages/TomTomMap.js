import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import ttSearch from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const TomTomMap = ({ latitude, longitude, onLocationChange }) => {
  const mapElement = useRef();
  const mapInstance = useRef();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {

    const map = tt.map({
      key: '0zufu6tFZVO6rLVv6xuBn36OquaP0Npx',
      container: mapElement.current,
      center: [35.2433, 38.9637],
      zoom: 4, // Initial zoom level set to 10 for a more zoomed-out view
      
    });

    mapInstance.current = map;

    const marker = new tt.Marker().setLngLat([longitude, latitude]).addTo(map);

    map.on('click', (event) => {
      const { lng, lat } = event.lngLat;
      marker.setLngLat([lng, lat]);
      onLocationChange({ latitude: lat, longitude: lng });  
      mapInstance.current.setCenter([lng, lat]);
      mapInstance.current.setZoom(14);
    });

    return () => map.remove();
  }, [latitude, longitude, onLocationChange]);

  
  const handleSearch = async (query) => {
    setQuery(query);
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await ttSearch.services.fuzzySearch({
        key: '0zufu6tFZVO6rLVv6xuBn36OquaP0Npx',
        query,
      });

      console.log('Fuzzy Search Response:', response); // Yanıtı kontrol et
      const validResults = response.results.filter(result => {
        const position = result.position;
        return position && (position.lon !== undefined || position.lng !== undefined) && position.lat !== undefined;
      });

      console.log('Valid Results:', validResults); // Geçerli sonuçları kontrol et
      setSuggestions(validResults);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleSuggestionClick = (position) => {
    // Doğru formatta olup olmadığını kontrol et ve düzelt
    const { lon, lat } = position.lng !== undefined ? { lon: position.lng, lat: position.lat } : position;
    
    if (lon !== undefined && lat !== undefined) {
      console.log('Setting center to:', { lon, lat });
      mapInstance.current.setCenter([lon, lat]);
      mapInstance.current.setZoom(14);
      onLocationChange({ latitude: lat, longitude: lon });
      setQuery('');
      setSuggestions([]);
    } else {
      console.error('Invalid position object:', position);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="Search for a location"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: '100%', padding: '8px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '36px',
          left: '0',
          right: '0',
          maxHeight: '200px',
          overflowY: 'auto',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          listStyle: 'none',
          padding: '0',
          margin: '0',
          zIndex: 1000
        }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion.position)}
              style={{
                padding: '8px',
                cursor: 'pointer',
              }}
            >
              {suggestion.address.freeformAddress}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapElement} style={{ height: '400px', width: '100%', marginTop: '10px' }} />
    </div>
  );
};

export default TomTomMap;
