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
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://newticax-backend.up.railway.app/api'
            : 'http://localhost:4000/api');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
          mode: 'cors',
        });
        
        clearTimeout(timeoutId);
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        console.warn('Backend check failed:', error);
        setBackendStatus('offline');
      }
    };

    // Always check backend status
    checkBackend();
    
    // Re-check every 30 seconds in development
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(checkBackend, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Show status in development mode or when backend is offline
  if (process.env.NODE_ENV === 'production' && backendStatus === 'online') {
    return null;
  }

  return (
    <div className={`border rounded-lg m-4 p-4 ${
      backendStatus === 'offline' 
        ? 'bg-red-50 border-red-200' 
        : backendStatus === 'online' 
        ? 'bg-green-50 border-green-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className={`${
        backendStatus === 'offline' 
          ? 'text-red-800' 
          : backendStatus === 'online' 
          ? 'text-green-800' 
          : 'text-yellow-800'
      }`}>
        {backendStatus === 'offline' && (
          <>
            <strong>⚠️ Backend Offline:</strong> Unable to connect to server. 
            Some features may not work properly.
            {process.env.NODE_ENV === 'development' && (
              <>
                <br />
                <span className="text-sm">
                  Make sure backend is running: 
                  <code className="text-xs bg-gray-100 text-gray-800 px-1 rounded ml-1">
                    cd backend && npm run dev
                  </code>
                </span>
              </>
            )}
          </>
        )}
        {backendStatus === 'online' && process.env.NODE_ENV === 'development' && (
          <>
            <strong>✅ Backend Online:</strong> Connected to development server.
          </>
        )}
        {backendStatus === 'checking' && (
          <>
            <strong>🔍 Checking:</strong> Verifying backend connection...
          </>
        )}
      </div>
    </div>
  );
};

// Main HomePage Component
export default function HomePage() {
  const { user, checkAuth, isAuthenticated, isInitialized } = useAuthStore();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Get user language preference or default to 'ENGLISH'
  const language = user?.language || 'ENGLISH';
  
  // Check auth status when component mounts (only if not initialized)
  useEffect(() => {
    console.log('🏠 HomePage mounted:', {
      isInitialized,
      isAuthenticated,
      hasUser: !!user,
      language,
      timestamp: new Date().toISOString(),
    });

    if (!isInitialized) {
      console.log('🔍 HomePage: Checking authentication status...');
      checkAuth().catch(error => {
        console.warn('⚠️ HomePage: Auth check failed (this is normal if backend is down):', error.message);
        // Don't throw error - app should continue working
      });
    }
    
    setIsPageLoaded(true);
  }, [isInitialized, checkAuth]);

  // Refresh data function
  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  // Fetch breaking news
  const { 
    data: breakingNews, 
    isLoading: isBreakingLoading, 
    error: breakingError,
    refetch: refetchBreaking 
  } = useQuery({
    queryKey: ['breakingNews', language, lastRefresh],
    queryFn: () => getBreakingNews(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Fetch trending articles
  const { 
    data: trendingArticles, 
    isLoading: isTrendingLoading, 
    error: trendingError,
    refetch: refetchTrending 
  } = useQuery({
    queryKey: ['trendingArticles', language, lastRefresh],
    queryFn: () => getTrendingArticles(language),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Fetch latest articles
  const { 
    data: latestArticles, 
    isLoading: isLatestLoading, 
    error: latestError,
    refetch: refetchLatest 
  } = useQuery({
    queryKey: ['latestArticles', language, lastRefresh],
    queryFn: () => getArticles({ page: 1, limit: 6, language }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Fetch categories
  const { 
    data: categoriesData, 
    error: categoriesError,
    refetch: refetchCategories 
  } = useQuery({
    queryKey: ['categories', lastRefresh],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    retryDelay: 1000,
    enabled: isPageLoaded,
  });

  // Loading and error states
  const isLoading = isBreakingLoading || isTrendingLoading || isLatestLoading || !isPageLoaded;
  const hasDataError = breakingError || trendingError || latestError || categoriesError;
  const hasAnyData = breakingNews || trendingArticles || latestArticles || categoriesData;

  // Refresh all data
  const handleRefreshAll = () => {
    console.log('🔄 Refreshing all data...');
    refetchBreaking();
    refetchTrending();
    refetchLatest();
    refetchCategories();
    refreshData();
  };

  // Show loading spinner during initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading NewticaX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Development Banner */}
      <DevBanner />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Backend Error Notice */}
        {hasDataError && !hasAnyData && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="text-yellow-600 text-4xl mb-4">🔌</div>
              <h3 className="text-yellow-800 font-semibold text-lg mb-2">
                Unable to Load Content
              </h3>
              <p className="text-yellow-700 mb-4">
                We're having trouble connecting to our content server. This might be temporary.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={handleRefreshAll}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  🔄 Try Again
                </button>
                <p className="text-yellow-600 text-sm">
                  or check back in a few moments
                </p>
              </div>
              
              {/* Development Info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-4 bg-yellow-100 rounded-lg text-left">
                  <h4 className="font-semibold text-yellow-800 mb-2">🔧 Developer Info:</h4>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>• Make sure backend server is running on port 4000</p>
                    <p>• Check if <code className="bg-yellow-200 px-1 rounded">http://localhost:4000/api/health</code> is accessible</p>
                    <p>• Verify CORS settings in backend configuration</p>
                    <p>• Check network connectivity and firewall settings</p>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-200 rounded text-xs">
                    <strong>Quick Start:</strong>
                    <br />
                    <code>cd backend && npm run dev</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Section with Breaking News */}
        {breakingNews && breakingNews.length > 0 && (
          <section className="mb-8">
            <HeroSection articles={breakingNews.slice(0, 3)} />
          </section>
        )}
        
        {/* Featured/Trending News Section */}
        {trendingArticles && trendingArticles.length > 0 && (
          <section className="mb-8 bg-gray-50 py-8">
            <FeaturedSection 
              title="🔥 Trending Now" 
              articles={trendingArticles.slice(0, 4)} 
            />
          </section>
        )}
        
        {/* Main Content Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Latest News - Main Content */}
            <div className="lg:col-span-3">
              {latestArticles?.data && latestArticles.data.length > 0 ? (
                <LatestSection 
                  title="📰 Latest News" 
                  articles={latestArticles.data} 
                  pagination={latestArticles.pagination}
                />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-gray-400 text-4xl mb-4">📰</div>
                  <h3 className="text-gray-600 font-medium mb-2">Latest News</h3>
                  <p className="text-gray-500 mb-4">
                    {latestError 
                      ? 'Unable to load latest news at the moment.' 
                      : 'No articles available right now.'
                    }
                  </p>
                  {latestError && (
                    <button
                      onClick={() => refetchLatest()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      🔄 Retry
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Popular Articles */}
              <div>
                {trendingArticles && trendingArticles.length > 0 ? (
                  <PopularSection 
                    title="🔥 Most Read" 
                    articles={trendingArticles.slice(0, 5)} 
                  />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400 text-3xl mb-3">🔥</div>
                    <h3 className="text-gray-600 font-medium mb-2">Most Read</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {trendingError 
                        ? 'Unable to load trending articles.' 
                        : 'No trending articles yet.'
                      }
                    </p>
                    {trendingError && (
                      <button
                        onClick={() => refetchTrending()}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        🔄 Retry
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* Categories */}
              <div>
                {categoriesData?.data && categoriesData.data.length > 0 ? (
                  <CategorySection 
                    title="📂 Categories" 
                    categories={categoriesData.data} 
                  />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-gray-400 text-3xl mb-3">📂</div>
                    <h3 className="text-gray-600 font-medium mb-2">Categories</h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {categoriesError 
                        ? 'Unable to load categories.' 
                        : 'No categories available.'
                      }
                    </p>
                    {categoriesError && (
                      <button
                        onClick={() => refetchCategories()}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        🔄 Retry
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Welcome Card (if authenticated) */}
              {isAuthenticated && user && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-3">👋</div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Welcome back, {user.name}!
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Stay updated with the latest news
                    </p>
                    <div className="text-xs text-gray-500">
                      Language: {user.language === 'ENGLISH' ? '🇺🇸 English' : '🇮🇩 Indonesian'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fallback Welcome Section */}
        {!hasAnyData && !isLoading && !hasDataError && (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📰</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to NewticaX
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Your go-to source for the latest news and trending stories from around the world.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Content is being prepared. Stay tuned for updates!
              </p>
              <button
                onClick={handleRefreshAll}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                🔄 Load Content
              </button>
            </div>
          </div>
        )}

        {/* Global Refresh Button (Development only) */}
        {process.env.NODE_ENV === 'development' && hasAnyData && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={handleRefreshAll}
              className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors text-sm"
              title="Refresh all data"
            >
              🔄 Refresh
            </button>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}