export const APP_CONFIG = {
  name: 'NewticaX',
  description: 'Your modern news platform with personalized content and multilingual support',
  version: '1.0.0',
  author: 'NewticaX Team',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  BOOKMARKS: '/dashboard/bookmarks',
  NOTIFICATIONS: '/dashboard/notifications',
  SEARCH: '/search',
  TRENDING: '/trending',
  LATEST: '/latest',
  BREAKING: '/breaking',
  ADMIN: '/dashboard/admin',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_BIO_LENGTH: 500,
  MAX_COMMENT_LENGTH: 1000,
} as const;

export const LANGUAGES = {
  ENGLISH: 'ENGLISH',
  INDONESIAN: 'INDONESIAN',
} as const;

export const USER_ROLES = {
  USER: 'USER',
  AUTHOR: 'AUTHOR',
  ADMIN: 'ADMIN',
} as const;

export const ARTICLE_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export const MEDIA_QUERIES = {
  SM: '(min-width: 640px)',
  MD: '(min-width: 768px)',
  LG: '(min-width: 1024px)',
  XL: '(min-width: 1280px)',
  '2XL': '(min-width: 1536px)',
} as const;
