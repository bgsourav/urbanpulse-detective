import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Car, CloudRain, AlertTriangle, ThumbsUp, ThumbsDown, Clock, MapPin } from 'lucide-react';
import { apiService } from '@/services/api';

const AlertCard = ({ alert, onFeedback }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'traffic':
        return <Car className="w-5 h-5" />;
      case 'weather':
        return <CloudRain className="w-5 h-5" />;
      case 'safety':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type, severity) => {
    const baseColors = {
      traffic: 'border-primary/30 bg-primary/5',
      weather: 'border-accent/30 bg-accent/5', 
      safety: 'border-destructive/30 bg-destructive/5'
    };
    
    const severityGlow = {
      low: '',
      medium: 'shadow-glow-primary/50',
      high: 'shadow-glow-alert animate-pulse-glow'
    };

    return `${baseColors[type]} ${severityGlow[severity]}`;
  };

  const handleFeedback = async (type) => {
    if (feedbackSubmitted || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await apiService.submitFeedback(alert.id, {
        type,
        alertType: alert.type,
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        setFeedbackSubmitted(true);
        onFeedback?.(alert.id, type);
        
        // Analytics tracking
        await apiService.submitAnalytics('alert_feedback', {
          alertId: alert.id,
          feedback: type,
          alertType: alert.type
        });
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card 
      className={cn(
        "relative p-4 cursor-pointer transition-all duration-300 ease-out border",
        "hover:scale-[1.02] hover:shadow-lg",
        getAlertColor(alert.type, alert.severity),
        isHovered && "border-primary/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Alert Content */}
      <div className={cn(
        "transition-opacity duration-300",
        isHovered && !feedbackSubmitted && "opacity-30"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            alert.type === 'traffic' && "bg-primary/20 text-primary",
            alert.type === 'weather' && "bg-accent/20 text-accent",
            alert.type === 'safety' && "bg-destructive/20 text-destructive"
          )}>
            {getAlertIcon(alert.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground truncate">
                {alert.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="w-3 h-3" />
                {alert.timeAgo}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {alert.description}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {alert.location}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300",
        !isHovered || feedbackSubmitted ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <Button
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleFeedback('like')}
          className={cn(
            "bg-accent/20 border-accent hover:bg-accent hover:text-accent-foreground",
            "shadow-glow-accent/30 transition-all duration-200"
          )}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Helpful
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleFeedback('dislike')}
          className={cn(
            "bg-destructive/20 border-destructive hover:bg-destructive hover:text-destructive-foreground",
            "shadow-glow-alert/30 transition-all duration-200"
          )}
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          Not Helpful
        </Button>
      </div>

      {/* Feedback Success State */}
      {feedbackSubmitted && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="text-center animate-scale-in">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
              <ThumbsUp className="w-4 h-4 text-accent-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Thanks for your feedback!</p>
          </div>
        </div>
      )}

      {/* Severity Indicator */}
      <div className={cn(
        "absolute top-2 right-2 w-2 h-2 rounded-full",
        alert.severity === 'low' && "bg-accent",
        alert.severity === 'medium' && "bg-warning",
        alert.severity === 'high' && "bg-destructive animate-pulse"
      )} />
    </Card>
  );
};

export default AlertCard;