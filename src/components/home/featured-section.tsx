import Link from 'next/link';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';

interface FeaturedSectionProps {
  title: string;
  articles: Article[];
}

export function FeaturedSection({ title, articles }: FeaturedSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/trending">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.id}>
              <div className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="aspect-video relative">
                  <img 
                    src={article.image || '/api/placeholder/600/400'} 
                    alt={article.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                      Trending
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{article.category?.name || 'Uncategorized'}</span>
                    <div className="flex items-center">
                      <span className="text-sm">{article._count?.likes || 0} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}