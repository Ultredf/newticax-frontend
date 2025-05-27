import { Category } from '@/types';
import Link from 'next/link';

interface ArticleHeaderProps {
  title: string;
  image?: string | null;
  category?: Category | null;
}

export function ArticleHeader({ title, image, category }: ArticleHeaderProps) {
  return (
    <div className="mb-6">
      {/* Category link */}
      {category && (
        <Link 
          href={`/category/${category.slug}`}
          className="inline-block mb-3 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          {category.name}
        </Link>
      )}
      
      {/* Article title */}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">{title}</h1>
      
      {/* Article image */}
      {image && (
        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}