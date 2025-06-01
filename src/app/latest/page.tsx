'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { getArticles, getBreakingNews } from '@/services/article-service';
import { getCategories } from '@/services/category-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleCard } from '@/components/article/article-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Filter, AlertTriangle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LatestPage() {
  const { language } = useAuthStore();
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'viewCount'>('publishedAt');
  
  // Fetch breaking news
  const { 
    data: breakingNews,
    isLoading: isBreakingLoading
  } = useQuery({
    queryKey: ['breakingNews', language],
    queryFn: () => getBreakingNews(language),
    staleTime: 1000 * 60 * 2, // 2 minutes for breaking news
  });
  
  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 50 }),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  
  // Fetch latest articles
  const { 
    data: articlesData,
    isLoading: isArticlesLoading,
    refetch 
  } = useQuery({
    queryKey: ['latestArticles', page, language, selectedCategory, sortBy],
    queryFn: () => getArticles({ 
      page, 
      limit: 12, 
      language,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sortBy,
      order: 'desc'
    }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page
  };

  const handleSortChange = (sort: 'publishedAt' | 'viewCount') => {
    setSortBy(sort);
    setPage(1); // Reset to first page
  };

  const isLoading = isBreakingLoading || isArticlesLoading;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Latest News</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Stay up to date with the most recent articles and breaking news from around the world.
          </p>
        </div>

        {/* Breaking News Section */}
        {breakingNews && breakingNews.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-xl font-semibold text-red-600">Breaking News</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
              {breakingNews.slice(0, 3).map((article) => (
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Category:</span>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.data.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publishedAt">Latest</SelectItem>
                  <SelectItem value="viewCount">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || sortBy !== 'publishedAt') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSortBy('publishedAt');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Articles Grid */}
        {isArticlesLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : articlesData?.data && articlesData.data.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {articlesData.data.length} of {articlesData.pagination.total} articles
                {selectedCategory !== 'all' && (
                  <span> in &quot;{categoriesData?.data.find(c => c.slug === selectedCategory)?.name}&quot;</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {articlesData.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            
            {articlesData.pagination && articlesData.pagination.pages > 1 && (
              <CustomPagination
                currentPage={page}
                totalPages={articlesData.pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedCategory !== 'all' 
                ? `No articles found in &quot;${categoriesData?.data.find(c => c.slug === selectedCategory)?.name}&quot; category.`
                : 'No articles are available at the moment.'
              }
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}