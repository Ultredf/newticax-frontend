import api from '@/lib/api';
import { DashboardStats } from '@/types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/dashboard');
  return response.data.data;
};

export const toggleTrendingArticle = async (id: string, isTrending: boolean): Promise<void> => {
  await api.put(`/admin/articles/${id}/trending`, { isTrending });
};

export const toggleBreakingNews = async (id: string, isBreaking: boolean): Promise<void> => {
  await api.put(`/admin/articles/${id}/breaking`, { isBreaking });
};

export const syncNewsAPI = async (data: {
  categories: string[];
  language: 'ENGLISH' | 'INDONESIAN';
}): Promise<any> => {
  const response = await api.post('/admin/sync-news', data);
  return response.data;
};