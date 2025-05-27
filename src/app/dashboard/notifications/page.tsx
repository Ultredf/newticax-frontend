// src/app/dashboard/notifications/page.tsx (new file)
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notification-service';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const router = useRouter();
  
  // Verify auth
  useAuth({
    requireAuth: true,
    redirectTo: '/login',
  });

  // Fetch notifications
  const { 
    data: notifications, 
    isLoading,
  } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getNotifications({ page, limit: 20 }),
  });

  // Mark single notification as read
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification marked as read');
    },
  });
  
  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  // Handle clicking on a notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
    
    // Route based on notification type
    if (notification.type === 'comment' || notification.type === 'like') {
      // Navigate to the article
      router.push(`/article/${notification.relatedId}`);
    } else if (notification.type === 'reply') {
      // Navigate to the comment
      router.push(`/article/${notification.relatedId}`);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count unread notifications
  const unreadCount = notifications?.data.filter(n => !n.read).length || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            View your activity notifications
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={() => markAllReadMutation.mutate()}>
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : notifications?.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any notifications yet.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {notifications?.data.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                                ${notification.read ? 'opacity-70' : 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className={`${notification.read ? '' : 'font-medium'}`}>{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {notifications?.pagination && notifications.pagination.pages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={notifications.pagination.pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}