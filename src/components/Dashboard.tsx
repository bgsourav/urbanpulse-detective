import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Settings, User, MapPin, Zap, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import AlertsPanel from './AlertsPanel';
import TopicSelection from './TopicSelection';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCcYX4UOrbhGNJRCFxhFsGPkQj4C_qPnFY';
const CITY_CENTER = { lat: 12.9141, lng: 77.6460 };

const Dashboard = () => {
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>();

  const handleTopicSelectionComplete = (interests: string[]) => {
    setUserInterests(interests);
    console.log('User selected interests:', interests);
  };

  // Load Google Maps script once
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstance.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (!mapRef.current) return;
      // initialize map
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: CITY_CENTER,
        zoom: 15,
        disableDefaultUI: true,
      });

      // sample marker
      new window.google.maps.Marker({
        position: CITY_CENTER,
        map: mapInstance.current,
        title: 'HSR Layout Center',
      });

      // clickable radius circle
      const circle = new window.google.maps.Circle({
        center: CITY_CENTER,
        radius: 500, // meters
        map: mapInstance.current,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2,
      });

      circle.addListener('click', () => {
        alert('You clicked inside the 500 m radius!');
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Pulse Bengaluru
                </h1>
                <p className="text-xs text-muted-foreground">
                  Real-time city intelligence platform
                </p>
              </div>
            </div>

            {/* Location Display */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">HSR Layout, Bengaluru</span>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 p-6 relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                City Alert Hub
              </h2>
              <p className="text-sm text-muted-foreground">
                Live monitoring of HSR Layout, Bengaluru
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">Traffic</Button>
                <Button variant="outline" size="sm" className="text-xs">Weather</Button>
                <Button variant="outline" size="sm" className="text-xs">Public Safety</Button>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
          
          {/* Map Container */}
          <div
            ref={mapRef}
            className="h-[calc(100vh-180px)] w-full rounded-lg shadow-lg"
          />

          {/* Topic Selection Button */}
          <Button
            onClick={() => setShowTopicSelection(true)}
            className="absolute top-4 right-4 bg-primary/90 hover:bg-primary shadow-glow-primary backdrop-blur-sm"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Topics
          </Button>
        </div>

        {/* Alerts Panel */}
        <div className="w-80 border-l border-border">
          <AlertsPanel className="h-full" />
        </div>
      </main>

      {/* Topic Selection Modal */}
      <TopicSelection
        isOpen={showTopicSelection}
        onClose={() => setShowTopicSelection(false)}
        onComplete={handleTopicSelectionComplete}
      />

      {/* Status Indicators */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Bell className="w-3 h-3" />
              <span>ML Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
