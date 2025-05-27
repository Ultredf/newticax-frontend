// src/components/dashboard/dashboard-content.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/services/article-service';
import { ArticleCard } from '@/components/article/article-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function DashboardContent() {
  const [selectedTab, setSelectedTab] = useState('latest');
  
  const { data: latestArticles, isLoading: isLatestLoading } = useQuery({
    queryKey: ['dashboardLatestArticles'],
    queryFn: () => getArticles({ page: 1, limit: 4 }),
  });

  const { data: trendingArticles, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['dashboardTrendingArticles'],
    queryFn: () => getArticles({ page: 1, limit: 4, isTrending: true }),
  });

  const isLoading = isLatestLoading || isTrendingLoading;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to your NewticaX dashboard. Here you can access your personalized content, 
            manage your bookmarks, and customize your reading experience.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="latest" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="latest">Latest Articles</TabsTrigger>
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
          <TabsTrigger value="recommended">For You</TabsTrigger>
        </TabsList>
        
        <TabsContent value="latest" className="mt-0">
          {isLatestLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : latestArticles?.data && latestArticles.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No latest articles found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0">
          {isTrendingLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : trendingArticles?.data && trendingArticles.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingArticles.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No trending articles found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recommended" className="mt-0">
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Your recommended articles will appear here based on your reading history and preferences.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}