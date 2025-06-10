import api from '@/lib/api';
import { Article, Comment } from '@/types';

// Likes
export const toggleLike = async (articleId: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  const response = await api.post(`/interactions/likes/${articleId}/toggle`);
  return response.data.data;
};

export const getLikedArticles = async (params?: { page?: number; limit?: number }): Promise<{
  data: Article[];
  pagination: any;
}> => {
  const response = await api.get('/interactions/likes', { params });
  return response.data;
};

// Bookmarks
export const toggleBookmark = async (articleId: string): Promise<{ isBookmarked: boolean }> => {
  const response = await api.post(`/interactions/bookmarks/${articleId}/toggle`);
  return response.data.data;
};

export const getBookmarkedArticles = async (params?: { page?: number; limit?: number }): Promise<{
  data: Article[];
  pagination: any;
}> => {
  const response = await api.get('/interactions/bookmarks', { params });
  return response.data;
};

// Shares
export const recordShare = async (articleId: string, platform?: string): Promise<void> => {
  await api.post(`/interactions/shares/${articleId}`, { platform });
};

// Comments
export const toggleCommentLike = async (commentId: string): Promise<{ isLiked: boolean; likeCount: number }> => {
  const response = await api.post(`/interactions/comments/${commentId}/like`);
  return response.data.data;
};

export const reportComment = async (commentId: string, reason: string): Promise<void> => {
  await api.post(`/interactions/comments/${commentId}/report`, { reason });
};

// Views
export const recordView = async (articleId: string): Promise<void> => {
  await api.post(`/interactions/views/${articleId}`);
};