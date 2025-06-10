export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
}

export const featureFlags: Record<string, FeatureFlag> = {
  // Core Features
  COMMENTS_SYSTEM: {
    name: 'Comments System',
    enabled: true,
    description: 'Enable article comments and replies'
  },
  
  SOCIAL_SHARING: {
    name: 'Social Sharing',
    enabled: true,
    description: 'Enable social media sharing buttons'
  },
  
  BOOKMARKS: {
    name: 'Bookmarks',
    enabled: true,
    description: 'Allow users to bookmark articles'
  },
  
  READING_HISTORY: {
    name: 'Reading History',
    enabled: true,
    description: 'Track user reading history'
  },
  
  // Advanced Features
  AI_RECOMMENDATIONS: {
    name: 'AI Recommendations',
    enabled: false,
    description: 'AI-powered article recommendations',
    rolloutPercentage: 25
  },
  
  REAL_TIME_NOTIFICATIONS: {
    name: 'Real-time Notifications',
    enabled: false,
    description: 'Push notifications for breaking news',
    rolloutPercentage: 50
  },
  
  ADVANCED_SEARCH: {
    name: 'Advanced Search',
    enabled: true,
    description: 'Enhanced search with filters and suggestions'
  },
  
  DARK_MODE: {
    name: 'Dark Mode',
    enabled: true,
    description: 'Dark theme support'
  },
  
  // Experimental Features
  ARTICLE_SUMMARIZATION: {
    name: 'Article Summarization',
    enabled: false,
    description: 'AI-generated article summaries',
    rolloutPercentage: 10
  },
  
  VOICE_READING: {
    name: 'Voice Reading',
    enabled: false,
    description: 'Text-to-speech for articles',
    rolloutPercentage: 15
  },
  
  OFFLINE_READING: {
    name: 'Offline Reading',
    enabled: false,
    description: 'Download articles for offline reading',
    rolloutPercentage: 20
  },
  
  // Admin Features
  BULK_OPERATIONS: {
    name: 'Bulk Operations',
    enabled: true,
    description: 'Bulk edit/delete for admin operations'
  },
  
  ANALYTICS_DASHBOARD: {
    name: 'Analytics Dashboard',
    enabled: true,
    description: 'Detailed analytics for administrators'
  },
  
  NEWS_SYNC: {
    name: 'External News Sync',
    enabled: true,
    description: 'Sync news from external APIs'
  }
};

export function isFeatureEnabled(featureName: keyof typeof featureFlags): boolean {
  const feature = featureFlags[featureName];
  if (!feature) return false;
  
  if (!feature.enabled) return false;
  
  // If rollout percentage is set, check if user is in rollout
  if (feature.rolloutPercentage !== undefined) {
    // Simple hash-based rollout (in production, use proper user ID)
    const hash = Math.abs(hashCode(featureName)) % 100;
    return hash < feature.rolloutPercentage;
  }
  
  return true;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

export function getEnabledFeatures(): string[] {
  return Object.keys(featureFlags).filter(feature => 
    isFeatureEnabled(feature as keyof typeof featureFlags)
  );
}