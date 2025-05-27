'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { getArticles, getBreakingNews, getTrendingArticles } from '@/services/article-service';
import { getCategories } from '@/services/category-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedSection } from '@/components/home/featured-section';
import { LatestSection } from '@/components/home/latest-section';
import { PopularSection } from '@/components/home/popular-section';
import { CategorySection } from '@/components/home/category-section';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  const { language, getMe, isAuthenticated } = useAuthStore();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // Check auth status
  useEffect(() => {
    if (!isAuthenticated) {
      getMe();
    }
    setIsPageLoaded(true);
  }, [isAuthenticated, getMe]);

  // Fetch breaking news
  const { data: breakingNews, isLoading: isBreakingLoading } = useQuery({
    queryKey: ['breakingNews', language],
    queryFn: () => getBreakingNews(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch trending articles
  const { data: trendingArticles, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingArticles', language],
    queryFn: () => getTrendingArticles(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch latest articles
  const { data: latestArticles, isLoading: isLatestLoading } = useQuery({
    queryKey: ['latestArticles', language],
    queryFn: () => getArticles({ page: 1, limit: 6, language }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const isLoading = isBreakingLoading || isTrendingLoading || isLatestLoading || !isPageLoaded;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Breaking News */}
        {breakingNews && breakingNews.length > 0 && (
          <HeroSection articles={breakingNews.slice(0, 3)} />
        )}
        
        {/* Featured/Trending News Section */}
        {trendingArticles && trendingArticles.length > 0 && (
          <FeaturedSection title="Trending Now" articles={trendingArticles.slice(0, 4)} />
        )}
        
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-3">
            <LatestSection 
              title="Latest News" 
              articles={latestArticles?.data || []} 
              pagination={latestArticles?.pagination}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Articles */}
            <PopularSection 
              title="Most Read" 
              articles={trendingArticles?.slice(0, 5) || []} 
            />
            
            {/* Categories */}
            <CategorySection 
              title="Categories" 
              categories={categoriesData?.data || []} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}