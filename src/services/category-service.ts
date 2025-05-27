import api from '@/lib/api';
import { Category, PaginatedResponse, PaginationParams } from '@/types';

export const getCategories = async (
  params?: PaginationParams & { search?: string }
): Promise<PaginatedResponse<Category>> => {
  const response = await api.get('/admin/categories', { params });
  return response.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get(`/categories/${slug}`);
  return response.data.data;
};

export const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
}): Promise<Category> => {
  const response = await api.post('/admin/categories', data);
  return response.data.data;
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; image?: string }
): Promise<Category> => {
  const response = await api.put(`/admin/categories/${id}`, data);
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/admin/categories/${id}`);
};