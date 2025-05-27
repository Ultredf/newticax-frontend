// src/components/dashboard/dashboard-stats.tsx
import { Users, FileText, MessageSquare, Tag, Eye, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';

interface DashboardStatsProps {
  stats: {
    users: number;
    articles: number;
    comments: number;
    categories: number;
  };
  contentStats: {
    totalViews: number;
    totalLikes: number;
    totalBookmarks: number;
    totalShares: number;
  };
}

export function DashboardStats({ stats, contentStats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Users"
        value={stats.users}
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title="Published Articles"
        value={stats.articles}
        icon={<FileText className="h-4 w-4" />}
      />
      <StatsCard
        title="Comments"
        value={stats.comments}
        icon={<MessageSquare className="h-4 w-4" />}
      />
      <StatsCard
        title="Categories"
        value={stats.categories}
        icon={<Tag className="h-4 w-4" />}
      />
      
      <StatsCard
        title="Total Views"
        value={contentStats.totalViews.toLocaleString()}
        icon={<Eye className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Likes"
        value={contentStats.totalLikes.toLocaleString()}
        icon={<ThumbsUp className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Bookmarks"
        value={contentStats.totalBookmarks.toLocaleString()}
        icon={<Bookmark className="h-4 w-4" />}
      />
      <StatsCard
        title="Total Shares"
        value={contentStats.totalShares.toLocaleString()}
        icon={<Share2 className="h-4 w-4" />}
      />
    </div>
  );
}