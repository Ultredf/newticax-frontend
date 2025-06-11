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

// Development Banner Component
const DevBanner = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'production' 
          ? 'https://newticax-backend-production.up.railway.app/api'
          : 'http://localhost:4000/api';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
        });
        
        clearTimeout(timeoutId);
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        console.warn('Backend check failed:', error);
        setBackendStatus('offline');
      }
    };

    if (process.env.NODE_ENV === 'development') {
      checkBackend();
    }
  }, []);

  // Only show in development mode and when backend is offline
  if (process.env.NODE_ENV !== 'development' || backendStatus !== 'offline') {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg m-4 p-4">
      <div className="text-red-800">
        <strong>Development Mode:</strong> Backend server is not running. 
        Some features may not work properly. Please start the backend server on port 4000.
        <br />
        <code className="text-xs bg-gray-100 text-gray-800 px-1 rounded mt-1 inline-block">
          cd backend && npm run dev
        </code>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { user, checkAuth, isAuthenticated, isInitialized } = useAuthStore();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // Get user language preference or default to 'ENGLISH'
  const language = user?.language || 'ENGLISH';
  
  // Check auth status when component mounts (only if not initialized)
  useEffect(() => {
    console.log('🏠 HomePage mounted:', {
      isInitialized,
      isAuthenticated,
      hasUser: !!user,
    });

    if (!isInitialized) {
      console.log('🔍 HomePage: Checking authentication status...');
      checkAuth().catch(error => {
        console.warn('⚠️ HomePage: Auth check failed (this is normal if backend is down):', error.message);
        // Don't throw error - app should continue working
      });
    }
    
    setIsPageLoaded(true);
  }, [isInitialized, checkAuth, isAuthenticated, user]);

  // Fetch breaking news
  const { data: breakingNews, isLoading: isBreakingLoading, error: breakingError } = useQuery({
    queryKey: ['breakingNews', language],
    queryFn: () => getBreakingNews(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Reduce retries to fail faster
    retryDelay: 1000, // 1 second delay
    enabled: isPageLoaded, // Only run when page is loaded
  });

  // Fetch trending articles
  const { data: trendingArticles, isLoading: isTrendingLoading, error: trendingError } = useQuery({
    queryKey: ['trendingArticles', language],
    queryFn: () => getTrendingArticles(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Fetch latest articles
  const { data: latestArticles, isLoading: isLatestLoading, error: latestError } = useQuery({
    queryKey: ['latestArticles', language],
    queryFn: () => getArticles({ page: 1, limit: 6, language }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Fetch categories
  const { data: categoriesData, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  const isLoading = isBreakingLoading || isTrendingLoading || isLatestLoading || !isPageLoaded;
  const hasDataError = breakingError || trendingError || latestError || categoriesError;
  const hasAnyData = breakingNews || trendingArticles || latestArticles || categoriesData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DevBanner />
      <Header />
      
      <main className="flex-1">
        {/* Show a notice if backend is down and no data loaded */}
        {hasDataError && !hasAnyData && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="text-yellow-800 font-semibold text-lg mb-2">
                🔌 Unable to Load Content
              </h3>
              <p className="text-yellow-700 mb-3">
                We're having trouble connecting to our content server. This might be temporary.
              </p>
              <p className="text-yellow-600 text-sm">
                Please try refreshing the page or check back in a few moments.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-yellow-100 rounded text-xs text-left">
                  <strong>Developer Info:</strong>
                  <br />• Make sure backend server is running on port 4000
                  <br />• Check if <code>http://localhost:4000/api/health</code> is accessible
                  <br />• Verify CORS settings in backend
                </div>
              )}
            </div>
          </div>
        )}

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
            {latestArticles?.data && latestArticles.data.length > 0 ? (
              <LatestSection 
                title="Latest News" 
                articles={latestArticles.data} 
                pagination={latestArticles.pagination}
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <h3 className="text-gray-600 font-medium mb-2">📰 Latest News</h3>
                <p className="text-gray-500">
                  {latestError ? 'Unable to load latest news at the moment.' : 'No articles available.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Articles */}
            {trendingArticles && trendingArticles.length > 0 ? (
              <PopularSection 
                title="Most Read" 
                articles={trendingArticles.slice(0, 5)} 
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-gray-600 font-medium mb-2">🔥 Most Read</h3>
                <p className="text-gray-500 text-sm">
                  {trendingError ? 'Unable to load trending articles.' : 'No trending articles yet.'}
                </p>
              </div>
            )}
            
            {/* Categories */}
            {categoriesData?.data && categoriesData.data.length > 0 ? (
              <CategorySection 
                title="Categories" 
                categories={categoriesData.data} 
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <h3 className="text-gray-600 font-medium mb-2">📂 Categories</h3>
                <p className="text-gray-500 text-sm">
                  {categoriesError ? 'Unable to load categories.' : 'No categories available.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fallback content when no data is available */}
        {!hasAnyData && !isLoading && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to NewticaX
              </h2>
              <p className="text-gray-600 mb-6">
                Your go-to source for the latest news and trending stories.
              </p>
              <p className="text-gray-500 text-sm">
                {hasDataError 
                  ? 'We\'re working to restore our content. Please check back soon!'
                  : 'Content is being prepared. Stay tuned!'
                }
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}