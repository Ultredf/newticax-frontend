import Link from 'next/link';
import { Article } from '@/types';
import { format } from 'date-fns';

interface ArticleListProps {
  articles: Article[];
  emptyMessage?: string;
  showReadAt?: boolean;
}

export function ArticleList({ articles, emptyMessage, showReadAt }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">{emptyMessage || 'No articles found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link href={`/article/${article.slug}`} key={article.id}>
          <div className="flex border rounded-lg overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-1/4 aspect-video">
              <img 
                src={article.image || '/api/placeholder/200/150'} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-medium text-lg mb-1 line-clamp-2">{article.title}</h3>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span>{article.category?.name || article.source || 'Uncategorized'}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                  {showReadAt && 'readAt' in article && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Read {format(new Date(article.readAt as string), 'MMM d, yyyy')}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {article._count?.likes || 0}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {article.viewCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
