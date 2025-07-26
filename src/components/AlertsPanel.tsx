import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Car, CloudRain, AlertTriangle, Filter, RefreshCw, Bell, BellOff } from 'lucide-react';
import AlertCard from './AlertCard';
import { apiService } from '@/services/api';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Alerts', icon: Bell },
  { id: 'traffic', label: 'Traffic', icon: Car },
  { id: 'weather', label: 'Weather', icon: CloudRain },
  { id: 'safety', label: 'Public Safety', icon: AlertTriangle }
];

const AlertsPanel = ({ className }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);

  const fetchAlerts = async (filter = 'all') => {
    try {
      const filterParam = filter === 'all' ? {} : { type: filter };
      const result = await apiService.getAlerts(filterParam);
      
      if (result.success) {
        setAlerts(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setIsLoading(true);
    fetchAlerts(filterId);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAlerts(activeFilter);
  };

  const handleAlertFeedback = (alertId, feedback) => {
    setFeedbackCount(prev => prev + 1);
    
    // Update alert to show feedback submitted
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, feedbackSubmitted: true, feedback }
        : alert
    ));
  };

  useEffect(() => {
    fetchAlerts();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts(activeFilter);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === activeFilter);

  return (
    <Card className={cn("bg-card border-border", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
              <p className="text-xs text-muted-foreground">
                {filteredAlerts.length} active alerts in HSR Layout
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            const count = filter.id === 'all' 
              ? alerts.length 
              : alerts.filter(a => a.type === filter.id).length;

            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange(filter.id)}
                className={cn(
                  "transition-all duration-200",
                  isActive 
                    ? "bg-gradient-primary shadow-glow-primary text-primary-foreground" 
                    : "hover:border-primary/50"
                )}
              >
                <Icon className="w-3 h-3 mr-2" />
                {filter.label}
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "ml-2 text-xs",
                      isActive 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-4 h-full border-border">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredAlerts.map((alert, index) => (
              <div 
                key={alert.id} 
                className="animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AlertCard 
                  alert={alert} 
                  onFeedback={handleAlertFeedback}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No Alerts</h3>
            <p className="text-sm text-muted-foreground">
              All clear! No {activeFilter === 'all' ? '' : activeFilter} alerts in your area.
            </p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {feedbackCount > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Feedback submitted: {feedbackCount}</span>
            <span>Helping improve our ML model</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AlertsPanel;