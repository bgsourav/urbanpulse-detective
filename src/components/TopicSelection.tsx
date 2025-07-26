import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X, Check } from 'lucide-react';
import { apiService } from '@/services/api';

const INTERESTS = [
  { id: 'cycling', label: 'Cycling', emoji: '🚴' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'restaurants', label: 'Restaurants', emoji: '🍽️' },
  { id: 'travelling-by-road', label: 'Travelling by Road', emoji: '🛣️' },
  { id: 'aviation', label: 'Aviation', emoji: '✈️' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'crypto', label: 'Crypto', emoji: '₿' },
  { id: 'baking', label: 'Baking', emoji: '🧁' },
  { id: 'botany', label: 'Botany', emoji: '🌿' },
  { id: 'cars', label: 'Cars', emoji: '🚗' },
  { id: 'real-estate', label: 'Real Estate', emoji: '🏠' },
  { id: 'technology', label: 'Technology', emoji: '📱' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'dogs', label: 'Dogs', emoji: '🐕' },
  { id: 'birds', label: 'Birds', emoji: '🐦' },
  { id: 'health-care', label: 'Health care', emoji: '🏥' },
  { id: 'geography', label: 'Geography', emoji: '🗺️' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'cats', label: 'Cats', emoji: '🐱' },
  { id: 'lgbtq', label: 'LGBTQ', emoji: '🏳️‍🌈' },
  { id: 'mental-health', label: 'Mental Health', emoji: '🧠' },
  { id: 'programming', label: 'Programming', emoji: '💻' },
  { id: 'cinema', label: 'Cinema', emoji: '🎬' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'travel', label: 'Travel', emoji: '🧳' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'photography', label: 'Photography', emoji: '📸' },
  { id: 'design', label: 'Design', emoji: '🎨' },
  { id: 'ufo', label: 'UFO', emoji: '🛸' },
  { id: 'music', label: 'Music', emoji: '🎵' }
];

const TopicSelection = ({ isOpen, onClose, onComplete }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 2) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await apiService.saveUserInterests(selectedInterests);
      
      if (result.success) {
        // Analytics tracking
        await apiService.submitAnalytics('interests_selected', {
          interests: selectedInterests,
          count: selectedInterests.length
        });
        
        onComplete?.(selectedInterests);
        onClose?.();
      }
    } catch (error) {
      console.error('Failed to save interests:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-lg relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Let's select your interests.
              </h2>
              <p className="text-muted-foreground">
                Please select two or more to proceed.
              </p>
            </div>

            {/* Interests Grid */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center max-h-80 overflow-y-auto px-2">
                {INTERESTS.map((interest, index) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  
                  return (
                    <Badge
                      key={interest.id}
                      variant="outline"
                      className={cn(
                        "px-4 py-2 cursor-pointer transition-all duration-200 animate-fade-in-up",
                        "hover:scale-105 hover:shadow-md border-2",
                        isSelected 
                          ? "bg-primary border-primary text-primary-foreground shadow-glow-primary" 
                          : "bg-background border-border hover:border-primary/50"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      <span className="mr-2">{interest.emoji}</span>
                      {interest.label}
                      {isSelected && (
                        <Check className="w-3 h-3 ml-2 animate-scale-in" />
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                {selectedInterests.length === 0 && "No interests selected"}
                {selectedInterests.length === 1 && "Select at least one more"}
                {selectedInterests.length >= 2 && `${selectedInterests.length} interests selected`}
              </div>
              
              <Button
                onClick={handleContinue}
                disabled={selectedInterests.length < 2 || isSubmitting}
                className={cn(
                  "w-full py-3 font-semibold transition-all duration-300",
                  selectedInterests.length >= 2 
                    ? "bg-gradient-primary hover:shadow-glow-primary animate-pulse-glow" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;