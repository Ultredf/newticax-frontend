import api from '@/lib/api';
import { User, PaginatedResponse, PaginationParams } from '@/types';

export const updateProfile = async (data: {
  name?: string;
  bio?: string;
  image?: string;
}): Promise<User> => {
  const response = await api.put('/auth/profile', data);
  return response.data.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put('/auth/password', data);
};

export const updatePreferences = async (data: {
  categories?: string[];
  notifications?: boolean;
  darkMode?: boolean;
  emailUpdates?: boolean;
}): Promise<void> => {
  await api.put('/auth/preferences', data);
};

// Admin functions
export const getUsers = async (
  params?: PaginationParams & { search?: string }
): Promise<PaginatedResponse<User>> => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserRole = async (
  id: string,
  role: 'USER' | 'AUTHOR' | 'ADMIN'
): Promise<User> => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};