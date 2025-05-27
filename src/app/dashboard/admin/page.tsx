'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/services/admin-service';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AdminStats } from '@/components/admin/admin-stats';
import { TopArticlesTable } from '@/components/admin/top-articles-table';
import { RecentArticlesTable } from '@/components/admin/recent-articles-table';
import { RecentUsersTable } from '@/components/admin/recent-users-table';

export default function AdminDashboardPage() {
  // Verify admin access
  const { user, isAdmin } = useAuth({
    requireAuth: true,
    requireAdmin: true,
    redirectTo: '/dashboard',
  });

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => getDashboardStats(),
    enabled: !!user && isAdmin,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform statistics
        </p>
      </div>

      <AdminStats stats={stats.counts} contentStats={stats.stats} />

      <Tabs defaultValue="topArticles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topArticles">Top Articles</TabsTrigger>
          <TabsTrigger value="recentArticles">Recent Articles</TabsTrigger>
          <TabsTrigger value="recentUsers">Recent Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="topArticles">
          <Card>
            <CardHeader>
              <CardTitle>Top Articles by Views</CardTitle>
            </CardHeader>
            <CardContent>
              <TopArticlesTable articles={stats.topArticles} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recentArticles">
          <Card>
            <CardHeader>
              <CardTitle>Recently Published Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentArticlesTable articles={stats.recentArticles} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recentUsers">
          <Card>
            <CardHeader>
              <CardTitle>Recently Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentUsersTable users={stats.recentUsers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}