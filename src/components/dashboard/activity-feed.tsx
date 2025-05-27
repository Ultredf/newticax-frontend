// src/components/dashboard/activity-feed.tsx
import { formatDistanceToNow } from 'date-fns';
import { FileText, MessageSquare, ThumbsUp, User, Bookmark } from 'lucide-react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'article' | 'comment' | 'like' | 'bookmark' | 'user';
  title: string;
  createdAt: string;
  link: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    );
  }

  // Get icon based on activity type
  const getIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'like':
        return <ThumbsUp className="h-4 w-4" />;
      case 'bookmark':
        return <Bookmark className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get color class based on activity type
  const getColorClass = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'comment':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'like':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'bookmark':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'user':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getColorClass(activity.type)}`}>
            {getIcon(activity.type)}
          </div>
          <div className="flex-1">
            <Link 
              href={activity.link} 
              className="font-medium hover:text-blue-600 transition-colors"
            >
              {activity.title}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}