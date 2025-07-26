import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Settings, User, MapPin, Zap, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import CityMap from './CityMap';
import AlertsPanel from './AlertsPanel';
import TopicSelection from './TopicSelection';

const Dashboard = () => {
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('HSR Layout, Bengaluru');
  const [userInterests, setUserInterests] = useState([]);
  const { theme, setTheme } = useTheme();

  const handleTopicSelectionComplete = (interests) => {
    setUserInterests(interests);
    console.log('User selected interests:', interests);
  };

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
                  Urban Pulse Detective
                </h1>
                <p className="text-xs text-muted-foreground">
                  Real-time city intelligence platform
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search areas in Bengaluru..."
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10 bg-secondary border-border focus:border-primary"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTopicSelection(true)}
                className="border-border hover:border-primary/50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
              
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
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                City Alert Hub
              </h2>
              <p className="text-sm text-muted-foreground">
                Live monitoring of {selectedLocation}
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
          
          <CityMap className="h-[calc(100vh-180px)]" />
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