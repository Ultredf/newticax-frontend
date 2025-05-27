import Link from 'next/link';
import { Article } from '@/types';

interface HeroSectionProps {
  articles: Article[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Featured Article */}
          <div className="lg:col-span-1">
            <Link href={`/article/${articles[0].slug}`}>
              <div className="group relative h-96 overflow-hidden rounded-xl">
                <img 
                  src={articles[0].image || '/api/placeholder/800/600'} 
                  alt={articles[0].title} 
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
                  <div className="absolute bottom-0 p-6 space-y-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md uppercase">
                      Breaking News
                    </span>
                    <h2 className="text-2xl font-bold leading-tight line-clamp-3">
                      {articles[0].title}
                    </h2>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {articles[0].summary}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary Featured Articles */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            {articles.slice(1, 3).map((article) => (
              <Link href={`/article/${article.slug}`} key={article.id}>
                <div className="group relative h-44 overflow-hidden rounded-xl">
                  <img 
                    src={article.image || '/api/placeholder/600/300'} 
                    alt={article.title} 
                    className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <div className="absolute bottom-0 p-4 space-y-1">
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md uppercase inline-block">
                        Breaking News
                      </span>
                      <h3 className="text-lg font-medium leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}