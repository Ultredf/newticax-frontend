import { Article } from '@/types';
import { ArticleCard } from '@/components/article/article-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
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
  onPageChange?: (page: number) => void;
}

export function LatestSection({ title, articles, pagination, onPageChange }: LatestSectionProps) {
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

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Default behavior - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          <CustomPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}