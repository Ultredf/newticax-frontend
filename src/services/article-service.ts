import api from '@/lib/api';
import {
  Article,
  ArticleInput,
  PaginatedResponse,
  PaginationParams,
  Comment,
  CommentInput,
} from '@/types';

// Article Fetching
export const getArticles = async (
  params?: PaginationParams & { language?: string; category?: string; tag?: string }
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get('/articles', { params });
  return response.data;
};

export const getArticleBySlug = async (slug: string): Promise<Article> => {
  const response = await api.get(`/articles/${slug}`);
  return response.data.data;
};

export const searchArticles = async (
  query: string,
  params?: PaginationParams & { language?: string }
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get('/articles/search', {
    params: {
      q: query,
      ...params,
    },
  });
  return response.data;
};

export const getBreakingNews = async (language?: string): Promise<Article[]> => {
  const response = await api.get('/articles/breaking', {
    params: { language },
  });
  return response.data.data;
};

export const getTrendingArticles = async (language?: string): Promise<Article[]> => {
  const response = await api.get('/articles/trending', {
    params: { language },
  });
  return response.data.data;
};

export const getArticlesByCategory = async (
  slug: string,
  params?: PaginationParams & { language?: string }
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get(`/articles/category/${slug}`, { params });
  return response.data;
};

export const getRecommendedArticles = async (): Promise<Article[]> => {
  const response = await api.get('/articles/recommended');
  return response.data.data;
};

// Article Interaction
export const incrementViewCount = async (id: string): Promise<void> => {
  await api.post(`/articles/${id}/view`);
};

export const incrementShareCount = async (id: string): Promise<void> => {
  await api.post(`/articles/${id}/share`);
};

// Bookmarks
export const getBookmarks = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get('/interactions/bookmarks', { params });
  return response.data;
};

export const bookmarkArticle = async (articleId: string): Promise<void> => {
  await api.post(`/interactions/bookmarks/${articleId}`);
};

export const removeBookmark = async (articleId: string): Promise<void> => {
  await api.delete(`/interactions/bookmarks/${articleId}`);
};

// Likes
export const likeArticle = async (articleId: string): Promise<void> => {
  await api.post(`/interactions/likes/${articleId}`);
};

export const unlikeArticle = async (articleId: string): Promise<void> => {
  await api.delete(`/interactions/likes/${articleId}`);
};

// Comments
export const getComments = async (
  articleId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Comment>> => {
  const response = await api.get(`/interactions/comments/${articleId}`, { params });
  return response.data;
};

export const addComment = async (
  articleId: string,
  data: CommentInput
): Promise<Comment> => {
  const response = await api.post(`/interactions/comments/${articleId}`, data);
  return response.data.data;
};

export const updateComment = async (
  commentId: string,
  data: { content: string }
): Promise<Comment> => {
  const response = await api.put(`/interactions/comments/${commentId}`, data);
  return response.data.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/interactions/comments/${commentId}`);
};

// Reading History
export const getReadingHistory = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Article>> => {
  const response = await api.get('/interactions/reading-history', { params });
  return response.data;
};

// Article Management (for admin/author)
export const createArticle = async (data: ArticleInput): Promise<Article> => {
  const response = await api.post('/articles', data);
  return response.data.data;
};

export const updateArticle = async (id: string, data: Partial<ArticleInput>): Promise<Article> => {
  const response = await api.put(`/articles/${id}`, data);
  return response.data.data;
};

export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/${id}`);
};