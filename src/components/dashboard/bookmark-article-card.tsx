import Link from 'next/link';
import { format } from 'date-fns';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Bookmark, ExternalLink } from 'lucide-react';

interface BookmarkArticleCardProps {
  article: Article;
  onRemove: () => void;
}

export function BookmarkArticleCard({ article, onRemove }: BookmarkArticleCardProps) {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <div className="w-1/4 aspect-video">
        <img 
          src={article.image || '/api/placeholder/200/150'} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{article.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <span>{article.category?.name || article.source || 'Uncategorized'}</span>
            <span className="mx-2">•</span>
            <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {article.summary}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/article/${article.slug}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Read Article
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={onRemove}>
            <Bookmark className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
