'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookmarks, removeBookmark } from '@/services/article-service';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookmarkArticleCard } from '@/components/dashboard/bookmark-article-card';

export default function BookmarksPage() {
  const [page, setPage] = useState(1);
  const { user } = useAuth({
    requireAuth: true,
    redirectTo: '/login',
  });

  const { 
    data: bookmarks, 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['bookmarks', page],
    queryFn: () => getBookmarks({ page, limit: 10 }),
    enabled: !!user,
  });

  const handleRemoveBookmark = async (articleId: string) => {
    try {
      await removeBookmark(articleId);
      toast.success('Bookmark removed');
      refetch();
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        <p className="text-muted-foreground">
          Manage your saved articles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Articles ({bookmarks?.pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks?.data && bookmarks.data.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.data.map((article) => (
                <BookmarkArticleCard
                  key={article.id}
                  article={article}
                  onRemove={() => handleRemoveBookmark(article.id)}
                />
              ))}
              
              {bookmarks.pagination.pages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={bookmarks.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven't bookmarked any articles yet.
              </p>
              <Button variant="outline" asChild>
                <a href="/">Browse Articles</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}