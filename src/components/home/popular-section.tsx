import Link from 'next/link';
import { Article } from '@/types';
import { format } from 'date-fns';

interface PopularSectionProps {
  title: string;
  articles: Article[];
}

export function PopularSection({ title, articles }: PopularSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Link href={`/article/${article.slug}`} key={article.id}>
              <div className="flex gap-3 group">
                <span className="font-bold text-xl text-gray-300 dark:text-gray-700">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-medium group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span>
                      {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{article._count?.likes || 0} likes</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}