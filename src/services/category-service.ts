import api from '@/lib/api';
import { Category, PaginatedResponse, PaginationParams } from '@/types';

// Public endpoints - no auth required
export const getCategories = async (
  params?: PaginationParams & { search?: string }
): Promise<PaginatedResponse<Category>> => {
  const response = await api.get('/categories', { params });
  return response.data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await api.get(`/categories/${slug}`);
  return response.data.data;
};

// Admin endpoints - auth required
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

// Admin-specific category fetch (with more detailed info)
export const getAdminCategories = async (
  params?: PaginationParams & { search?: string }
): Promise<PaginatedResponse<Category>> => {
  const response = await api.get('/admin/categories', { params });
  return response.data;
};