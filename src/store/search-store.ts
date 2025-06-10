import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  query: string;
  recentSearches: string[];
  filters: {
    category?: string;
    dateRange?: { from?: Date; to?: Date };
    sortBy: 'relevance' | 'date' | 'popularity';
  };
  setQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setFilters: (filters: Partial<SearchState['filters']>) => void;
  clearFilters: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: '',
      recentSearches: [],
      filters: {
        sortBy: 'relevance',
      },
      
      setQuery: (query) => {
        set({ query });
        if (query.trim() && !get().recentSearches.includes(query.trim())) {
          get().addRecentSearch(query.trim());
        }
      },
      
      addRecentSearch: (query) => {
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10)
        }));
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
      
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },
      
      clearFilters: () => {
        set({
          filters: { sortBy: 'relevance' }
        });
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        filters: state.filters,
      }),
    }
  )
);
