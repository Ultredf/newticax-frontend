import api from '@/lib/api';

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number; }>;
  topArticles: Array<{ id: string; title: string; views: number; }>;
  userEngagement: {
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
  };
}

export const getAnalytics = async (
  startDate: string,
  endDate: string
): Promise<AnalyticsData> => {
  const response = await api.get('/admin/analytics', {
    params: { startDate, endDate },
  });
  return response.data.data;
};

export const trackPageView = async (path: string): Promise<void> => {
  await api.post('/analytics/pageview', { path });
};

export const trackEvent = async (
  event: string,
  properties?: Record<string, any>
): Promise<void> => {
  await api.post('/analytics/event', { event, properties });
};

export const getUserAnalytics = async (userId: string): Promise<{
  totalViews: number;
  articlesRead: number;
  timeSpent: number;
  lastActive: string;
  preferredCategories: string[];
}> => {
  const response = await api.get(`/admin/users/${userId}/analytics`);
  return response.data.data;
};