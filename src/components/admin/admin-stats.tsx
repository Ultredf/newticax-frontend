import { Users, FileText, MessageSquare, Tag, Eye, ThumbsUp, Bookmark, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStatsProps {
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

export function AdminStats({ stats, contentStats }: AdminStatsProps) {
  const statsCards = [
    {
      title: "Total Users",
      value: stats.users.toLocaleString(),
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Published Articles",
      value: stats.articles.toLocaleString(),
      icon: <FileText className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Comments",
      value: stats.comments.toLocaleString(),
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Categories",
      value: stats.categories.toLocaleString(),
      icon: <Tag className="h-4 w-4" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
      title: "Total Views",
      value: contentStats.totalViews.toLocaleString(),
      icon: <Eye className="h-4 w-4" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Total Likes",
      value: contentStats.totalLikes.toLocaleString(),
      icon: <ThumbsUp className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      title: "Total Bookmarks",
      value: contentStats.totalBookmarks.toLocaleString(),
      icon: <Bookmark className="h-4 w-4" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Total Shares",
      value: contentStats.totalShares.toLocaleString(),
      icon: <Share2 className="h-4 w-4" />,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}