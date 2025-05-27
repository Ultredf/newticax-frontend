import Link from 'next/link';
import { Category } from '@/types';

interface CategorySectionProps {
  title: string;
  categories: Category[];
}

export function CategorySection({ title, categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) return null;

  // Helper function to get a color class based on category name
  const getCategoryColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
    ];

    // Create a deterministic index based on the category name
    const index = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link href={`/category/${category.slug}`} key={category.id}>
              <span className={`inline-block px-3 py-2 rounded-lg ${getCategoryColor(category.name)} hover:opacity-90 transition-opacity`}>
                {category.name}
                {category._count?.articles && (
                  <span className="ml-1 text-xs opacity-80">({category._count.articles})</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}