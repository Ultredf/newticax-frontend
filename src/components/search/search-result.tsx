'use client';

import { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchResultsProps {
  results: Article[];
  isLoading: boolean;
  query: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
}

export function SearchResults({
  results,
  isLoading,
  query,
  pagination,
  onPageChange,
  onRetry
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">Search for articles</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a search term to find articles.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find any articles matching "{query}". Try different keywords or browse by category.
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">
          {pagination?.total ? `Found ${pagination.total} results` : `Results`} for "{query}"
        </h2>
        {pagination && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {results.length} articles on page {pagination.page} of {pagination.pages}
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <CustomPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}
    </div>
  );
}