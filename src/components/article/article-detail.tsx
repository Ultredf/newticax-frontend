import React from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { 
  Article, 
  Author, 
  Category, 
  Tag,
  ArticleDetailProps as BaseArticleDetailProps 
} from '@/types/article';

// Local interfaces to avoid conflicts
interface ArticleDetailProps {
  article: Article;
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
}

interface ArticleDetailErrorProps {
  error?: string;
  onRetry?: () => void;
}

interface RelatedArticleCardProps {
  article: Article;
}

// Content cleaning utilities
const cleanContent = (content: string): string => {
  if (!content) return '';
  return content.replace(/\[\+\d+\s*chars?\]$/i, '').trim();
};

const isContentShort = (content: string): boolean => {
  return content ? content.length < 500 : false;
};

const formatContent = (content: string): string => {
  const cleaned = cleanContent(content);
  // Convert line breaks to HTML
  return cleaned.replace(/\n/g, '<br />');
};

// Safe boolean conversion utility
const toBool = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
};

// Main Component
export function ArticleDetail({ 
  article, 
  onLike, 
  onBookmark, 
  onShare 
}: ArticleDetailProps) {
  const displayContent = cleanContent(article.content || '');
  const displaySummary = cleanContent(article.summary || '');
  const shouldShowExternalNotice = toBool(article.isExternal) && (
    toBool(article.hasFullContentAtSource) || 
    toBool(article.isContentTruncated) || 
    isContentShort(displayContent) || 
    Boolean(article.contentNote)
  );

  // Handle action buttons
  const handleLike = () => {
    onLike && onLike();
  };

  const handleBookmark = () => {
    onBookmark && onBookmark();
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: displaySummary,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        {/* Breadcrumb */}
        {article.category && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link 
                  href={`/category/${article.category.slug}`}
                  className="hover:text-blue-600"
                >
                  {article.category.name}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-700 font-medium truncate">
                {article.title}
              </li>
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {article.title}
        </h1>
        
        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          {/* Author */}
          {article.author && (
            <div className="flex items-center">
              {article.author.image && (
                <img 
                  src={article.author.image} 
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {article.author.name}
                </p>
                {article.author.bio && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {article.author.bio}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
            </span>
            
            {article.category && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <Link 
                  href={`/category/${article.category.slug}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                >
                  {article.category.name}
                </Link>
              </span>
            )}
            
            {/* External source indicator */}
            {toBool(article.isExternal) && article.source && (
              <span className="flex items-center text-blue-600 dark:text-blue-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Source: {article.source}
              </span>
            )}
          </div>
        </div>
        
        {/* Article Image */}
        {article.image && (
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}
      </header>
      
      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-8">
        {/* Summary */}
        {displaySummary && (
          <div className="text-xl text-gray-700 dark:text-gray-300 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-l-4 border-blue-500">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="leading-relaxed">{displaySummary}</p>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {displayContent ? (
            <div 
              className="prose-content space-y-4"
              dangerouslySetInnerHTML={{ __html: formatContent(displayContent) }}
            />
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                Content preview not available
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Please visit the original source for the full article content.
              </p>
            </div>
          )}
        </div>
        
        {/* External Article Notice */}
        {shouldShowExternalNotice && article.sourceUrl && (
          <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  📰 Complete Article Available
                </h3>
                <p className="text-blue-800 dark:text-blue-200 mb-4 leading-relaxed">
                  {article.contentNote || 
                   "This is a preview of the article. The complete content with full details, images, and formatting is available at the original source."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span>Read Full Article at {article.source}</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Article Actions & Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount.toLocaleString()} views
            </span>
            
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {article._count?.likes || 0} likes
            </span>
            
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {article._count?.comments || 0} comments
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLike}
              className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                toBool(article.isLiked)
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                  : 'bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600'
              }`}
            >
              <svg className={`w-4 h-4 mr-2 ${toBool(article.isLiked) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {toBool(article.isLiked) ? 'Liked' : 'Like'}
            </button>
            
            <button 
              onClick={handleBookmark}
              className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-200 ${
                toBool(article.isBookmarked)
                  ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' 
                  : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <svg className={`w-4 h-4 mr-2 ${toBool(article.isBookmarked) ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {toBool(article.isBookmarked) ? 'Saved' : 'Save'}
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-600 hover:border-green-300 hover:text-green-600 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Related Topics
          </h3>
          <div className="flex flex-wrap gap-3">
            {article.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {article.relatedArticles && article.relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {article.relatedArticles.map((relatedArticle) => (
              <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// Related Article Card Component
function RelatedArticleCard({ article }: RelatedArticleCardProps) {
  const cleanSummary = (summary: string) => {
    if (!summary) return '';
    return summary.replace(/\[\+\d+\s*chars?\]$/i, '').trim();
  };

  const displaySummary = cleanSummary(article.summary || '');

  return (
    <Link href={`/article/${article.slug}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:-translate-y-1">
        {/* Image */}
        {article.image && (
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Category Badge */}
            {article.category && (
              <div className="absolute top-3 left-3">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  {article.category.name}
                </span>
              </div>
            )}
            {/* External Badge */}
            {toBool(article.isExternal) && (
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  External
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-5">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h4>
          
          {displaySummary && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
              {displaySummary}
            </p>
          )}
          
          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center space-x-3">
              <span>{format(new Date(article.publishedAt), 'MMM d')}</span>
              {toBool(article.isExternal) && article.source && (
                <span className="text-blue-600 dark:text-blue-400">
                  via {article.source}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.viewCount || 0}
              </span>
              
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {article._count?.likes || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Loading Component
export function ArticleDetailSkeleton(): React.JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-32"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
        </div>
        <div className="h-64 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-4 mb-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
      </div>
      
      {/* Actions Skeleton */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex space-x-3">
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
export function ArticleDetailError({ error, onRetry }: ArticleDetailErrorProps): React.JSX.Element {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Article Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error || "The article you're looking for doesn't exist or has been removed."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
          
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Comment Components
interface CommentProps {
  comment: {
    id: string;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user: {
      id: string;
      name: string;
      username?: string;
      image?: string;
    };
    replies?: CommentProps['comment'][];
    _count?: {
      replies: number;
    };
    hasMoreReplies?: boolean;
  };
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
}

export function Comment({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  depth = 0 
}: CommentProps) {
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);

  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Comment Header */}
        <div className="flex items-center mb-3">
          {comment.user.image && (
            <img
              src={comment.user.image}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full mr-3 object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.user.name}
              </h4>
              {comment.user.username && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  @{comment.user.username}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {comment.content}
            </p>
          </div>
        )}

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            Reply
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            Delete
          </button>
          {comment._count && comment._count.replies > 0 && (
            <span className="text-gray-500 dark:text-gray-400">
              {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
            </span>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyContent.trim()}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Comments Section Component
interface CommentsSectionProps {
  articleId: string;
  comments: CommentProps['comment'][];
  onCommentAdd?: (content: string, parentId?: string) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentDelete?: (commentId: string) => void;
  loading?: boolean;
}

export function CommentsSection({ 
  articleId, 
  comments, 
  onCommentAdd, 
  onCommentEdit, 
  onCommentDelete, 
  loading 
}: CommentsSectionProps) {
  const [newComment, setNewComment] = React.useState('');

  const handleAddComment = () => {
    if (newComment.trim() && onCommentAdd) {
      onCommentAdd(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={4}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={onCommentAdd}
              onEdit={onCommentEdit}
              onDelete={onCommentDelete}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export
export default ArticleDetail;