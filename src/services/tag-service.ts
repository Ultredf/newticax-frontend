// src/services/tag-service.ts (new file)
import api from '@/lib/api';
import { Tag, PaginatedResponse, PaginationParams } from '@/types';

export const getTags = async (
  params?: PaginationParams & { search?: string }
): Promise<PaginatedResponse<Tag>> => {
  const response = await api.get('/admin/tags', { params });
  return response.data;
};

export const createTag = async (data: { name: string }): Promise<Tag> => {
  const response = await api.post('/admin/tags', data);
  return response.data.data;
};

export const updateTag = async (id: string, data: { name: string }): Promise<Tag> => {
  const response = await api.put(`/admin/tags/${id}`, data);
  return response.data.data;
};

export const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/admin/tags/${id}`);
};