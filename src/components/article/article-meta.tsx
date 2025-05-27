import { format } from 'date-fns';
import { Author } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ArticleMetaProps {
  author?: Author | null;
  publishedAt: string;
  source?: string | null;
  sourceUrl?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export function ArticleMeta({ 
  author, 
  publishedAt, 
  source, 
  sourceUrl,
  viewCount,
  likeCount,
  commentCount
}: ArticleMetaProps) {
  const formattedDate = format(new Date(publishedAt), 'MMMM d, yyyy');
  
  return (
    <div className="flex flex-wrap items-center justify-between py-4 border-y mb-8">
      <div className="flex items-center mb-2 sm:mb-0">
        {author ? (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={author.image || ''} alt={author.name} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
            </div>
          </div>
        ) : (
          <div>
            {source && (
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Source:</span>
                {sourceUrl ? (
                  <a 
                    href={sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {source}
                  </a>
                ) : (
                  <span className="text-sm">{source}</span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {viewCount}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likeCount}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          {commentCount}
        </div>
      </div>
    </div>
  );
}