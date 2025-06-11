import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchArticles } from '@/services/article-service';
import { useAuthStore } from '@/store/auth-store';
import { Article, PaginatedResponse } from '@/types';

interface UseSearchOptions {
  initialQuery?: string;
  initialPage?: number;
  limit?: number;
  initialLanguage?: 'ENGLISH' | 'INDONESIAN';
}

interface SearchFilters {
  category?: string;
  dateRange?: { from?: Date; to?: Date };
  sortBy?: 'relevance' | 'date' | 'popularity';
  language?: 'ENGLISH' | 'INDONESIAN';
}

export function useSearch(options: UseSearchOptions = {}) {
  const { 
    initialQuery = '', 
    initialPage = 1, 
    limit = 12,
    initialLanguage = 'ENGLISH'
  } = options;
  
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState<SearchFilters>({
    language: initialLanguage
  });
     
  // Get user and language from auth store
  const { user } = useAuthStore();
  
  // Use user's language preference if available, otherwise use filter language or default
  const userLanguage = user?.language || filters.language || initialLanguage;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching
  } = useQuery<PaginatedResponse<Article>>({
    queryKey: ['search', query, page, filters, userLanguage],
    queryFn: () => searchArticles(query, {
      page,
      limit,
      language: userLanguage,
      ...filters
    }),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery.trim());
    setPage(1); // Reset to first page when searching
  }, []);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const setLanguage = useCallback((language: 'ENGLISH' | 'INDONESIAN') => {
    updateFilters({ language });
  }, [updateFilters]);

  const setCategory = useCallback((category?: string) => {
    updateFilters({ category });
  }, [updateFilters]);

  const setSortBy = useCallback((sortBy: 'relevance' | 'date' | 'popularity') => {
    updateFilters({ sortBy });
  }, [updateFilters]);

  const setDateRange = useCallback((dateRange?: { from?: Date; to?: Date }) => {
    updateFilters({ dateRange });
  }, [updateFilters]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage > 0 && (!data?.pagination || newPage <= data.pagination.pages)) {
      setPage(newPage);
    }
  }, [data?.pagination]);

  const goToNextPage = useCallback(() => {
    if (data?.pagination && page < data.pagination.pages) {
      setPage(prev => prev + 1);
    }
  }, [data?.pagination, page]);

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setPage(1);
    setFilters({
      language: userLanguage // Keep language preference
    });
  }, [userLanguage]);

  const clearFilters = useCallback(() => {
    setFilters({
      language: userLanguage // Keep language preference
    });
    setPage(1);
  }, [userLanguage]);

  // Computed values
  const hasResults = data?.data && data.data.length > 0;
  const hasMore = data?.pagination ? page < data.pagination.pages : false;
  const hasPrevious = page > 1;
  const totalResults = data?.pagination?.total || 0;
  const currentLanguage = userLanguage;

  // Search suggestions or recent searches could be added here
  const canSearch = query.length > 0;
  const isSearching = isLoading || isFetching;

  return {
    // Search state
    query,
    page,
    filters,
    currentLanguage,
    
    // Results
    results: data?.data || [],
    pagination: data?.pagination,
    hasResults,
    totalResults,
    
    // Loading states
    isLoading,
    isFetching,
    isRefetching,
    isSearching,
    isError,
    error,
    
    // Navigation
    hasMore,
    hasPrevious,
    canSearch,
    
    // Actions
    search,
    updateFilters,
    setLanguage,
    setCategory,
    setSortBy,
    setDateRange,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    clearSearch,
    clearFilters,
    refetch,
  };
}

// Custom hook for search suggestions (optional enhancement)
export function useSearchSuggestions(query: string, limit = 5) {
  const { user } = useAuthStore();
  const userLanguage = user?.language || 'ENGLISH';

  const {
    data: suggestions,
    isLoading: isSuggestionsLoading,
  } = useQuery({
    queryKey: ['search-suggestions', query, userLanguage],
    queryFn: async () => {
      if (query.length < 2) return [];
      
      // This would call an API endpoint for suggestions
      // For now, return empty array
      return [];
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    suggestions: suggestions || [],
    isSuggestionsLoading,
  };
}

// Custom hook for search history (optional enhancement)
export function useSearchHistory(limit = 10) {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('search-history');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const addToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(q => q !== query)].slice(0, limit);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('search-history', JSON.stringify(newHistory));
        } catch (error) {
          console.warn('Failed to save search history:', error);
        }
      }
      
      return newHistory;
    });
  }, [limit]);

  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory(prev => {
      const newHistory = prev.filter(q => q !== query);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('search-history', JSON.stringify(newHistory));
        } catch (error) {
          console.warn('Failed to save search history:', error);
        }
      }
      
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('search-history');
      } catch (error) {
        console.warn('Failed to clear search history:', error);
      }
    }
  }, []);

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}

// Type exports for external use
export type { UseSearchOptions, SearchFilters };