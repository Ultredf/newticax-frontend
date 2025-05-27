'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getArticlesByCategory } from '@/services/article-service';
import { getCategoryBySlug } from '@/services/category-service';
import { useAuthStore } from '@/store/auth-store';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleCard } from '@/components/article/article-card';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CategoryPage() {
  const { slug } = useParams();
  const { language } = useAuthStore();
  const [page, setPage] = useState(1);
  
  // Fetch category
  const { data: category, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => getCategoryBySlug(slug as string),
  });
  
  // Fetch articles
  const { 
    data: articlesData,
    isLoading: isArticlesLoading,
    refetch 
  } = useQuery({
    queryKey: ['categoryArticles', slug, page, language],
    queryFn: () => getArticlesByCategory(slug as string, { page, limit: 12, language }),
  });

  const isLoading = isCategoryLoading || isArticlesLoading;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{category?.name || 'Category'}</h1>
              {category?.description && (
                <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
              )}
            </div>
            
            {articlesData?.source === 'external' && (
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  These articles are from external sources. Some features may be limited.
                </p>
              </div>
            )}
            
            {articlesData?.data.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No articles found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  There are no articles in this category yet.
                </p>
                <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {articlesData?.data.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                    />
                  ))}
                </div>
                
                {articlesData?.pagination && articlesData.pagination.pages > 1 && (
                  <Pagination 
                    currentPage={page}
                    totalPages={articlesData.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}