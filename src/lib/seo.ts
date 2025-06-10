import { Metadata } from 'next';
import { APP_CONFIG } from './constants';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function generateSEO({
  title,
  description = APP_CONFIG.description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;
  const fullUrl = url ? `${APP_CONFIG.url}${url}` : APP_CONFIG.url;
  const imageUrl = image ? `${APP_CONFIG.url}${image}` : `${APP_CONFIG.url}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      images: [{ url: imageUrl }],
      type,
      siteName: APP_CONFIG.name,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    ...(tags && { keywords: tags.join(', ') }),
  };
}

export function generateArticleSEO(article: {
  title: string;
  summary: string;
  image?: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author?: { name: string };
  tags?: { name: string }[];
}): Metadata {
  return generateSEO({
    title: article.title,
    description: article.summary,
    image: article.image,
    url: `/article/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: article.author ? [article.author.name] : undefined,
    tags: article.tags?.map(tag => tag.name),
  });
}