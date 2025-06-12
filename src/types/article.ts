// Frontend types (src/types/article.ts)

export type Language = 'ENGLISH' | 'INDONESIAN';
export type Role = 'USER' | 'AUTHOR' | 'ADMIN';
export type Provider = 'EMAIL' | 'GOOGLE' | 'GITHUB';

// Base interfaces
export interface Author {
  id: string;
  name: string;
  username?: string;
  image?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  image?: string;
  bio?: string;
  role: Role;
  language: Language;
  provider?: Provider;
  createdAt: string;
  updatedAt: string;
  preference?: {
    categories: string[];
    notifications: boolean;
    darkMode: boolean;
    emailUpdates: boolean;
  };
  _count?: {
    articles: number;
    bookmarks: number;
    likes: number;
    comments: number;
  };
}

// Main Article interface
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  image?: string;
  source?: string;
  sourceUrl?: string;
  externalId?: string;
  isExternal: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  published: boolean;
  publishedAt: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  language: Language;
  viewCount: number;
  shareCount: number;
  
  // Enhanced fields for external content handling
  isContentTruncated?: boolean;
  hasFullContentAtSource?: boolean;
  contentNote?: string;
  qualityScore?: number;
  processingNote?: string;
  
  // Relations
  author?: Author;
  category?: Category;
  tags?: Tag[];
  _count?: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  
  // User interaction status (for authenticated users) - explicitly boolean
  isBookmarked?: boolean;
  isLiked?: boolean;
  
  // Additional metadata
  relatedArticles?: Article[];
}

// Comment interface with nested replies
export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  articleId: string;
  userId: string;
  parentId?: string;
  user: {
    id: string;
    name: string;
    username?: string;
    image?: string;
  };
  replies?: Comment[];
  _count?: {
    replies: number;
  };
  hasMoreReplies?: boolean;
}

// Component Props Interfaces

export interface ArticleCardProps {
  article: Article;
  isCompact?: boolean;
  showActions?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;
  showExternalBadge?: boolean;
  className?: string;
  onLike?: (articleId: string) => void;
  onBookmark?: (articleId: string) => void;
  onShare?: (article: Article) => void;
  onClick?: (article: Article) => void;
}

export interface ArticleDetailProps {
  article: Article & {
    contentNote?: string;
    hasFullContentAtSource?: boolean;
    isContentTruncated?: boolean;
    relatedArticles?: Article[];
  };
  loading?: boolean;
  error?: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onCommentAdd?: (comment: string, parentId?: string) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
}

export interface NewsCardProps {
  id: string | number;
  image: string;
  category: string;
  title: string;
  excerpt?: string;
  time: string;
  views: number;
  shares: number;
  isCompact?: boolean;
  isExternal?: boolean;
  source?: string;
  sourceUrl?: string;
  className?: string;
  onClick?: () => void;
}

export interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  hasMore?: boolean;
  isCompact?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  className?: string;
  emptyMessage?: string;
  loadingComponent?: React.ComponentType;
  onLoadMore?: () => void;
  onPageChange?: (page: number) => void;
  onArticleClick?: (article: Article) => void;
  onArticleLike?: (articleId: string) => void;
  onArticleBookmark?: (articleId: string) => void;
}

export interface ArticleGridProps extends Omit<ArticleListProps, 'isCompact'> {
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

export interface RelatedArticleCardProps {
  article: Article;
  showImage?: boolean;
  showCategory?: boolean;
  showStats?: boolean;
  className?: string;
  onClick?: (article: Article) => void;
}

export interface ArticleSearchProps {
  query: string;
  category?: string;
  tag?: string;
  author?: string;
  language?: Language;
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  onQueryChange: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onTagChange?: (tag: string) => void;
  onAuthorChange?: (author: string) => void;
  onSortChange?: (sortBy: string, sortOrder: string) => void;
  onClear?: () => void;
}

export interface ArticleFiltersProps {
  categories: Category[];
  tags: Tag[];
  selectedCategory?: string;
  selectedTags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isExternal?: boolean;
  language?: Language;
  onCategoryChange: (category?: string) => void;
  onTagsChange: (tags: string[]) => void;
  onDateRangeChange: (range?: { start: Date; end: Date }) => void;
  onExternalToggle: (isExternal: boolean) => void;
  onLanguageChange: (language: Language) => void;
  onReset: () => void;
}

// API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  meta?: Record<string, any>;
  errors?: ValidationError[];
  source?: 'internal' | 'external';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Form Types

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  language?: Language;
}

export interface ProfileUpdateFormData {
  name: string;
  bio?: string;
  image?: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ArticleCreateFormData {
  title: string;
  content: string;
  summary: string;
  image?: string;
  categoryId?: string;
  tagIds?: string[];
  language?: Language;
  published?: boolean;
}

export interface CommentFormData {
  content: string;
  parentId?: string;
}

// State Management Types

export interface ArticleState {
  articles: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  filters: {
    category?: string;
    tag?: string;
    search?: string;
    language?: Language;
  };
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: Language;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  notifications: Notification[];
  modals: {
    login: boolean;
    register: boolean;
    profile: boolean;
    share: boolean;
  };
}

// Hook Types

export interface UseArticlesOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  language?: Language;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  trending?: boolean;
  breaking?: boolean;
}

export interface UseArticlesResult {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  updateFilters: (filters: Partial<UseArticlesOptions>) => void;
}

export interface UseArticleResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
  related: Article[];
  refresh: () => void;
  like: () => Promise<void>;
  bookmark: () => Promise<void>;
  share: () => void;
}

export interface UseCommentsResult {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  addComment: (content: string, parentId?: string) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  loadReplies: (commentId: string) => Promise<void>;
}

// Utility Types

export interface SearchFilters {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  language?: Language;
  isExternal?: boolean;
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticleStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  engagementRate: number;
}

export interface ContentQuality {
  score: number;
  issues: string[];
  suggestions: string[];
  isTruncated: boolean;
  hasFullContent: boolean;
}

// Event Handler Types

export type ArticleEventHandler = (article: Article) => void;
export type ArticleActionHandler = (articleId: string) => void | Promise<void>;
export type CommentEventHandler = (comment: Comment) => void;
export type CommentActionHandler = (commentId: string, content?: string) => void | Promise<void>;

// External Content Types

export interface ExternalContentInfo {
  isExternal: boolean;
  source?: string;
  sourceUrl?: string;
  isTruncated: boolean;
  hasFullContent: boolean;
  contentNote?: string;
  qualityScore?: number;
}

export interface ContentPreview {
  title: string;
  summary: string;
  image?: string;
  isComplete: boolean;
  readingTime: number;
  wordCount: number;
}

// Social Sharing Types

export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export interface ShareOptions {
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  whatsapp?: boolean;
  telegram?: boolean;
  copy?: boolean;
  native?: boolean;
}

// Notification Types

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Reading Progress Types

export interface ReadingProgress {
  articleId: string;
  progress: number; // 0-100
  timeSpent: number; // in seconds
  scrollPosition: number;
  completed: boolean;
}

export interface ReadingStats {
  totalArticlesRead: number;
  totalTimeSpent: number;
  averageReadingTime: number;
  preferredCategories: Array<{
    category: string;
    count: number;
  }>;
  readingStreak: number;
}

// Performance & Analytics Types

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  errorRate: number;
}

export interface UserAnalytics {
  sessionId: string;
  userId?: string;
  events: Array<{
    type: string;
    timestamp: number;
    data: Record<string, any>;
  }>;
}

// Error Types

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

export interface FormError {
  field: string;
  message: string;
  type: 'required' | 'validation' | 'server';
}

// SEO & Meta Types

export interface ArticleMeta {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Constants for frontend use

export const ARTICLE_CONSTANTS = {
  MAX_TITLE_LENGTH: 200,
  MAX_SUMMARY_LENGTH: 500,
  MAX_CONTENT_PREVIEW: 300,
  MIN_READING_TIME: 1,
  MAX_TAGS_PER_ARTICLE: 10,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
} as const;

export const UI_CONSTANTS = {
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 200,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

export const CACHE_CONSTANTS = {
  ARTICLES_TTL: 5 * 60 * 1000, // 5 minutes
  ARTICLE_DETAIL_TTL: 10 * 60 * 1000, // 10 minutes
  USER_PROFILE_TTL: 15 * 60 * 1000, // 15 minutes
  SEARCH_RESULTS_TTL: 3 * 60 * 1000, // 3 minutes
} as const;

// Default values

export const DEFAULT_ARTICLE: Partial<Article> = {
  viewCount: 0,
  shareCount: 0,
  isExternal: false,
  isBreaking: false,
  isTrending: false,
  published: true,
  language: 'ENGLISH',
  _count: {
    likes: 0,
    comments: 0,
    bookmarks: 0,
  },
};

export const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  pages: 0,
};

export const DEFAULT_FILTERS: SearchFilters = {
  sortBy: 'date',
  sortOrder: 'desc',
  language: 'ENGLISH',
};