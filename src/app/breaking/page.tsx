'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { getBreakingNews, getArticles } from '@/services/article-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleCard } from '@/components/article/article-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

export default function BreakingNewsPage() {
  const { language } = useAuthStore();
  const [page, setPage] = useState(1);
  
  // Fetch latest breaking news
  const { 
    data: breakingNews,
    isLoading: isBreakingLoading
  } = useQuery({
    queryKey: ['breakingNews', language],
    queryFn: () => getBreakingNews(language),
    staleTime: 1000 * 60 * 2, // 2 minutes for breaking news
  });
  
  // Fetch all breaking news articles with pagination
  const { 
    data: allBreakingNews,
    isLoading: isAllBreakingLoading,
    refetch 
  } = useQuery({
    queryKey: ['allBreakingNews', page, language],
    queryFn: () => getArticles({ 
      page, 
      limit: 12, 
      language,
      isBreaking: true,
      sortBy: 'publishedAt',
      order: 'desc'
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = isBreakingLoading || isAllBreakingLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-red-600">Breaking News</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Stay informed with the latest breaking news and urgent updates from around the world.
          </p>
        </div>

        {/* Latest Breaking News Highlight */}
        {breakingNews && breakingNews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-semibold text-red-600">Latest Updates</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
              {breakingNews.slice(0, 2).map((article) => (
                <div key={article.id} className="relative">
                  <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                    BREAKING
                  </Badge>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Breaking News */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">All Breaking News</h2>
        </div>

        {isAllBreakingLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : allBreakingNews?.data && allBreakingNews.data.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {allBreakingNews.data.length} of {allBreakingNews.pagination.total} breaking news articles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {allBreakingNews.data.map((article) => (
                <div key={article.id} className="relative">
                  <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                    BREAKING
                  </Badge>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
            
            {allBreakingNews.pagination && allBreakingNews.pagination.pages > 1 && (
              <CustomPagination
                currentPage={page}
                totalPages={allBreakingNews.pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Breaking News</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There are no breaking news articles at the moment. Check back later for urgent updates.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        )}

        {/* Auto-refresh notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This page automatically refreshes every 2 minutes to show the latest breaking news.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}