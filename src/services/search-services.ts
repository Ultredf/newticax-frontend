import api from '@/lib/api';
import { Article, PaginatedResponse, PaginationParams } from '@/types';

export interface SearchParams extends PaginationParams {
  language?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'relevance' | 'date' | 'popularity';
  author?: string;
}

export const searchArticles = async (
  query: string,
  params?: SearchParams
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get('/articles/search', {
    params: {
      q: query,
      ...params,
    },
  });
  return response.data;
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  const response = await api.get('/articles/search/suggestions', {
    params: { q: query },
  });
  return response.data.data;
};

export const getPopularSearchTerms = async (): Promise<string[]> => {
  const response = await api.get('/articles/search/popular');
  return response.data.data;
};

export const saveSearchQuery = async (query: string): Promise<void> => {
  await api.post('/articles/search/save', { query });
};

export const getSearchHistory = async (): Promise<string[]> => {
  const response = await api.get('/articles/search/history');
  return response.data.data;
};

export const clearSearchHistory = async (): Promise<void> => {
  await api.delete('/articles/search/history');
};
