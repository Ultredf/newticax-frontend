// User types - sesuai dengan Prisma schema
export interface User {
  id: string;
  name: string;
  username?: string | null; // Optional dan bisa null sesuai Prisma
  email: string;
  image?: string | null;
  bio?: string | null;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
  createdAt: string;
  language: 'ENGLISH' | 'INDONESIAN';
  provider?: 'EMAIL' | 'GOOGLE' | 'GITHUB' | null;
  preference?: UserPreference;
}

export interface UserPreference {
  id: string;
  userId: string;
  categories: string[];
  notifications: boolean;
  darkMode: boolean;
  emailUpdates: boolean;
}

// Auth types - sesuai dengan Prisma schema
export interface RegisterInput {
  name: string;
  username?: string; // Optional sesuai Prisma
  email: string;
  password: string;
  language?: 'ENGLISH' | 'INDONESIAN';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
}

// Article types - sesuai dengan Prisma schema
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  externalId?: string | null;
  isExternal: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  shareCount: number;
  author?: Author | null;
  authorId?: string | null;
  category?: Category | null;
  categoryId?: string | null;
  tags?: Tag[];
  language: 'ENGLISH' | 'INDONESIAN';
  _count?: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  isBookmarked?: boolean;
  isLiked?: boolean;
  relatedArticles?: Article[];
}

export interface ArticleInput {
  title: string;
  content: string;
  summary: string;
  image?: string;
  categoryId?: string;
  tagIds?: string[];
  language?: 'ENGLISH' | 'INDONESIAN';
  isBreaking?: boolean;
  isTrending?: boolean;
  published?: boolean;
}

export interface Author {
  id: string;
  name: string;
  username?: string | null;
  image?: string | null;
}

// Category types - sesuai dengan Prisma schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  _count?: {
    articles: number;
  };
}

// Tag types - sesuai dengan Prisma schema
export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
}

// Comment types - sesuai dengan Prisma schema
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: Author;
  userId: string;
  articleId: string;
  parentId?: string | null;
  replies?: Comment[];
  _count?: {
    replies: number;
  };
}

export interface CommentInput {
  content: string;
  parentId?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  source?: 'internal' | 'external';
}

// Dashboard types for admin
export interface DashboardStats {
  counts: {
    users: number;
    articles: number;
    comments: number;
    categories: number;
  };
  topArticles: Article[];
  recentArticles: Article[];
  recentUsers: User[];
  stats: {
    totalViews: number;
    totalLikes: number;
    totalBookmarks: number;
    totalShares: number;
  };
}

// Notification type - sesuai dengan Prisma schema
export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  userId: string;
  relatedId?: string | null;
  createdAt: string;
}

// News API cache type - sesuai dengan Prisma schema
export interface NewsApiCache {
  id: string;
  endpoint: string;
  params: string;
  data: string;
  language: 'ENGLISH' | 'INDONESIAN';
  expiresAt: string;
  createdAt: string;
}