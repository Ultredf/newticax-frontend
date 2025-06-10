'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchArticles } from '@/services/article-service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

export function SearchSuggestions({ 
  query, 
  onSuggestionClick, 
  isVisible 
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Popular search terms (could be fetched from API)
  const popularSearches = [
    'Breaking news',
    'Technology',
    'Politics',
    'Sports',
    'Health',
    'Business',
    'Entertainment'
  ];

  // Fetch suggestions based on query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: () => searchArticles(query, { limit: 5 }),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (searchResults?.data) {
      // Extract unique titles as suggestions
      const titleSuggestions = searchResults.data
        .map(article => article.title)
        .slice(0, 5);
      setSuggestions(titleSuggestions);
    }
  }, [searchResults]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 mt-1">
      {query.length > 2 ? (
        <div>
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner size="sm" className="mx-auto" />
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 rounded-none"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="line-clamp-1">{suggestion}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No suggestions found
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular Searches
          </div>
          {popularSearches.map((search, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 rounded-none"
              onClick={() => onSuggestionClick(search)}
            >
              <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
              {search}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}