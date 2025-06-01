'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReadingHistory } from '@/services/article-service';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArticleList } from '@/components/dashboard/article-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ReadingHistoryPage() {
  const [page, setPage] = useState(1);
  
  // Verify auth
  useAuth({
    requireAuth: true,
    redirectTo: '/login',
  });

  // Fetch reading history
  const { 
    data: historyData, 
    isLoading
  } = useQuery({
    queryKey: ['readingHistory', page],
    queryFn: () => getReadingHistory({ page, limit: 10 }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reading History</h1>
        <p className="text-muted-foreground">
          View your recently read articles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recently Read Articles ({historyData?.pagination.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : historyData?.data && historyData.data.length > 0 ? (
            <div className="space-y-4">
              <ArticleList 
                articles={historyData.data} 
                emptyMessage="You haven&apos;t read any articles yet."
                showReadAt
              />
              
              {historyData.pagination.pages > 1 && (
                <div className="mt-6">
                  <CustomPagination
                    currentPage={page}
                    totalPages={historyData.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven&apos;t read any articles yet.
              </p>
              <Button variant="outline" asChild>
                <Link href="/">Browse Articles</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}