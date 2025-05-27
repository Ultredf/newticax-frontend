'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { searchArticles } from '@/services/article-service';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ArticleCard } from '@/components/article/article-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  
  const { language } = useAuthStore();
  const [searchInput, setSearchInput] = useState(query);
  
  // Sync URL params with state
  useEffect(() => {
    setSearchInput(query);
  }, [query]);
  
  // Search articles
  const { 
    data: searchResults, 
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ['search', query, currentPage, language],
    queryFn: () => searchArticles(query, { 
      page: currentPage, 
      limit: 12, 
      language 
    }),
    enabled: query.length > 0,
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };
  
  const handlePageChange = (page: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl font-bold mb-4">Search Articles</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search for articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
              />
              <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        {query ? (
          <div>
            {isLoading || isFetching ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">
                    {searchResults?.data.length === 0 
                      ? 'No results found' 
                      : `Found ${searchResults?.pagination.total} results for "${query}"`}
                  </h2>
                </div>
                
                {searchResults?.source === 'external' && (
                  <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      These results are from external sources. Some features may be limited.
                    </p>
                  </div>
                )}
                
                {searchResults?.data.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try different keywords or browse by category.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                      {searchResults?.data.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                    
                    {searchResults?.pagination && searchResults.pagination.pages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={searchResults.pagination.pages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term to find articles.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}