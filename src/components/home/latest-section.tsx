import { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LatestSectionProps {
  title: string;
  articles: Article[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function LatestSection({ title, articles, pagination }: LatestSectionProps) {
  if (!articles || articles.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No articles found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/latest">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => {
              // Handle page change - this would typically update query params
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}