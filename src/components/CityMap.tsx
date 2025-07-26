import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader } from 'lucide-react';

const CityMap = ({ alerts = [], onLocationSelect, className }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const initializeMap = (token) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [77.6446, 12.9121], // HSR Layout, Bengaluru
      zoom: 13,
      pitch: 45,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Style the map for dark theme
    map.current.on('style.load', () => {
      // Add atmosphere and glow effects
      map.current.setFog({
        color: 'rgb(30, 30, 40)',
        'high-color': 'rgb(50, 50, 70)',
        'horizon-blend': 0.1,
      });
    });

    // Add alert markers
    addAlertMarkers();
  };

  const addAlertMarkers = () => {
    if (!map.current || !alerts.length) return;

    alerts.forEach((alert) => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'alert-marker';
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${getMarkerColor(alert.type, alert.severity)};
        border: 2px solid white;
        box-shadow: 0 0 15px ${getMarkerGlow(alert.type)};
        cursor: pointer;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      `;

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
      });

      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = 'auto';
      });

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'alert-popup'
      }).setHTML(`
        <div class="p-3 bg-background border border-border rounded-lg shadow-lg">
          <h4 class="font-semibold text-foreground mb-1">${alert.title}</h4>
          <p class="text-sm text-muted-foreground mb-2">${alert.description}</p>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <span>📍 ${alert.location}</span>
            <span>⏰ ${alert.timeAgo}</span>
          </div>
        </div>
      `);

      // Add marker to map
      new mapboxgl.Marker({ element: markerElement })
        .setLngLat([alert.coordinates.lng, alert.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current);
    });
  };

  const getMarkerColor = (type, severity) => {
    const colors = {
      traffic: severity === 'high' ? '#ef4444' : '#3b82f6',
      weather: severity === 'high' ? '#f59e0b' : '#10b981',
      safety: severity === 'high' ? '#dc2626' : '#f97316'
    };
    return colors[type] || '#6b7280';
  };

  const getMarkerGlow = (type) => {
    const glows = {
      traffic: 'rgba(59, 130, 246, 0.5)',
      weather: 'rgba(16, 185, 129, 0.5)',
      safety: 'rgba(239, 68, 68, 0.5)'
    };
    return glows[type] || 'rgba(107, 114, 128, 0.5)';
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      initializeMap(mapboxToken);
      setShowTokenInput(false);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && alerts.length > 0) {
      // Clear existing markers and add new ones
      const markers = document.querySelectorAll('.alert-marker');
      markers.forEach(marker => marker.remove());
      addAlertMarkers();
    }
  }, [alerts]);

  if (showTokenInput) {
    return (
      <div className={cn("relative bg-secondary rounded-lg border border-border", className)}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Setup Map Integration
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your Mapbox public token to view the interactive city map with real-time alerts.
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJhYmMxMjM..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="bg-background border-border"
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
              <Button 
                onClick={handleTokenSubmit}
                disabled={!mapboxToken.trim() || isLoading}
                className="bg-gradient-primary hover:shadow-glow-primary"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative bg-secondary rounded-lg border border-border overflow-hidden", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Overlay UI */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search HSR Layout, Bengaluru..."
              className="bg-transparent border-0 focus-visible:ring-0 text-sm"
              onChange={(e) => onLocationSelect?.(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3">
          <h4 className="text-xs font-semibold text-foreground mb-2">Alert Types</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              Traffic
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              Weather
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              Safety
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMap;