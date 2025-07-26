// Urban Pulse Detective API Service
// This handles all backend communications for the hackathon MVP

const API_BASE_URL = 'http://localhost:3001/api'; // Dummy endpoint for now

// Mock data generators for hackathon demo
const generateMockAlert = (id, type) => {
  const alertTypes = {
    traffic: {
      icon: 'car',
      titles: ['Road Closed', 'Heavy Traffic', 'Accident Reported', 'Construction Zone'],
      descriptions: [
        'Main St blocked due to accident',
        'Delays on I-85 southbound',
        'Multi-vehicle collision on HSR Layout Main Road',
        'Road repair work in progress'
      ]
    },
    weather: {
      icon: 'cloud-rain',
      titles: ['Thunderstorms', 'Heavy Rain', 'Flood Warning', 'Weather Alert'],
      descriptions: [
        'Severe storms expected in the area',
        'Flash flood warning issued',
        'Heavy rainfall affecting visibility',
        'Strong winds and hail possible'
      ]
    },
    safety: {
      icon: 'alert-triangle',
      titles: ['Event Advisory', 'Security Alert', 'Public Notice', 'Emergency Response'],
      descriptions: [
        'Protest planned downtown',
        'Increased police presence',
        'Emergency drill in progress',
        'Public safety announcement'
      ]
    }
  };

  const typeData = alertTypes[type] || alertTypes.safety;
  const randomTitle = typeData.titles[Math.floor(Math.random() * typeData.titles.length)];
  const randomDesc = typeData.descriptions[Math.floor(Math.random() * typeData.descriptions.length)];
  const timeAgo = Math.floor(Math.random() * 60) + 1;

  return {
    id,
    type,
    title: randomTitle,
    description: randomDesc,
    timeAgo: `${timeAgo} mins ago`,
    location: 'HSR Layout, Bengaluru',
    coordinates: {
      lat: 12.9121 + (Math.random() - 0.5) * 0.01,
      lng: 77.6446 + (Math.random() - 0.5) * 0.01
    },
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    icon: typeData.icon
  };
};

// API Functions
export const apiService = {
  // Alerts API
  async getAlerts(filters = {}) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock alerts
      const alerts = [];
      const types = ['traffic', 'weather', 'safety'];
      
      for (let i = 0; i < 8; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        if (!filters.type || filters.type === type) {
          alerts.push(generateMockAlert(i + 1, type));
        }
      }
      
      return {
        success: true,
        data: alerts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return { success: false, error: error.message };
    }
  },

  async submitFeedback(alertId, feedback) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`Feedback submitted for alert ${alertId}:`, feedback);
      
      return {
        success: true,
        message: 'Feedback recorded successfully',
        data: { alertId, feedback, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }
  },

  // User Preferences API
  async saveUserInterests(interests) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('User interests saved:', interests);
      
      return {
        success: true,
        message: 'Interests saved successfully',
        data: { interests, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Error saving interests:', error);
      return { success: false, error: error.message };
    }
  },

  async getUserProfile() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        data: {
          id: 'user_123',
          name: 'Demo User',
          location: 'HSR Layout, Bengaluru',
          interests: ['Technology', 'Health care', 'Finance'],
          alertPreferences: {
            traffic: true,
            weather: true,
            safety: true
          }
        }
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Location API
  async searchLocations(query) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const mockLocations = [
        'HSR Layout, Bengaluru',
        'Koramangala, Bengaluru',
        'Indiranagar, Bengaluru',
        'Whitefield, Bengaluru',
        'Electronic City, Bengaluru'
      ].filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        success: true,
        data: mockLocations.map(location => ({
          name: location,
          coordinates: {
            lat: 12.9121 + (Math.random() - 0.5) * 0.1,
            lng: 77.6446 + (Math.random() - 0.5) * 0.1
          }
        }))
      };
    } catch (error) {
      console.error('Error searching locations:', error);
      return { success: false, error: error.message };
    }
  },

  // Analytics API (for ML feedback loop)
  async submitAnalytics(eventType, data) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log(`Analytics event: ${eventType}`, data);
      
      return {
        success: true,
        message: 'Analytics data recorded'
      };
    } catch (error) {
      console.error('Error submitting analytics:', error);
      return { success: false, error: error.message };
    }
  }
};

export default apiService;