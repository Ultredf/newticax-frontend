// src/services/notification-service.ts (new file)
import api from '@/lib/api';
import { Notification, PaginatedResponse, PaginationParams } from '@/types';

export const getNotifications = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Notification>> => {
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};