'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { getTrendingArticles, getArticles } from '@/services/article-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleCard } from '@/components/article/article-card';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Eye } from 'lucide-react';

export default function TrendingPage() {
  const { language } = useAuthStore();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('trending');
  
  // Fetch trending articles
  const { 
    data: trendingArticles,
    isLoading: isTrendingLoading
  } = useQuery({
    queryKey: ['trendingArticles', language],
    queryFn: () => getTrendingArticles(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch popular articles (most viewed)
  const { 
    data: popularArticles,
    isLoading: isPopularLoading
  } = useQuery({
    queryKey: ['popularArticles', page, language],
    queryFn: () => getArticles({ 
      page, 
      limit: 12, 
      language,
      sortBy: 'viewCount',
      order: 'desc'
    }),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch recent articles
  const { 
    data: recentArticles,
    isLoading: isRecentLoading
  } = useQuery({
    queryKey: ['recentArticles', page, language],
    queryFn: () => getArticles({ 
      page, 
      limit: 12, 
      language,
      sortBy: 'publishedAt',
      order: 'desc'
    }),
    staleTime: 1000 * 60 * 5,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLoading = isTrendingLoading || isPopularLoading || isRecentLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold">Trending News</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover the most popular and trending articles that everyone is talking about right now.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Most Viewed</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
          </TabsList>

          {/* Trending Articles */}
          <TabsContent value="trending" className="space-y-6">
            {isTrendingLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : trendingArticles && trendingArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No trending articles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for trending content.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Popular Articles */}
          <TabsContent value="popular" className="space-y-6">
            {isPopularLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : popularArticles?.data && popularArticles.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularArticles.data.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {popularArticles.pagination && popularArticles.pagination.pages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={popularArticles.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No popular articles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for popular content.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Recent Articles */}
          <TabsContent value="recent" className="space-y-6">
            {isRecentLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : recentArticles?.data && recentArticles.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentArticles.data.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                
                {recentArticles.pagination && recentArticles.pagination.pages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={recentArticles.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No recent articles</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for recent content.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}