// src/components/notifications/notification-dropdown.tsx (new file)
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notification-service';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  
  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ limit: 10 }),
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Mark single notification as read
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  
  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
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
    
    setOpen(false);
  };
  
  // Handle "Mark all as read"
  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };
  
  // Count unread notifications
  const unreadCount = notifications?.data.filter(n => !n.read).length || 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 px-1.5 min-w-4 h-4 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        ) : notifications?.data.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          <>
            {notifications?.data.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`px-4 py-3 cursor-pointer ${notification.read ? 'opacity-60' : 'font-medium'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            
            {notifications && notifications.pagination.total > notifications.data.length && (
              <DropdownMenuItem onClick={() => router.push('/dashboard/notifications')}>
                <div className="text-center w-full text-sm text-blue-600">
                  View all notifications
                </div>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}