import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchArticles } from '@/services/article-service';
import { useAuthStore } from '@/store/auth-store';
import { Article, PaginatedResponse } from '@/types';

interface UseSearchOptions {
  initialQuery?: string;
  initialPage?: number;
  limit?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { initialQuery = '', initialPage = 1, limit = 12 } = options;
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState<{
    category?: string;
    dateRange?: { from?: Date; to?: Date };
    sortBy?: 'relevance' | 'date' | 'popularity';
  }>({});
  
  const { language } = useAuthStore();

  const { 
    data, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<PaginatedResponse<Article>>({
    queryKey: ['search', query, page, filters, language],
    queryFn: () => searchArticles(query, { 
      page, 
      limit, 
      language,
      ...filters 
    }),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page
  }, []);

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setPage(1);
    setFilters({});
  }, []);

  return {
    query,
    page,
    filters,
    results: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    search,
    updateFilters,
    goToPage,
    clearSearch,
    refetch
  };
}