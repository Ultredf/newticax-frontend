// src/components/dashboard/top-articles-table.tsx
import Link from 'next/link';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface TopArticlesTableProps {
  articles: Article[];
}

export function TopArticlesTable({ articles }: TopArticlesTableProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 dark:text-gray-400">No articles found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Likes</TableHead>
            <TableHead className="text-right">Comments</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <Link 
                  href={`/article/${article.slug}`} 
                  className="font-medium hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </Link>
              </TableCell>
              <TableCell>
                {article.category ? (
                  <Badge variant="outline">{article.category.name}</Badge>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Uncategorized</span>
                )}
              </TableCell>
              <TableCell className="text-right">{article.viewCount.toLocaleString()}</TableCell>
              <TableCell className="text-right">{(article._count?.likes || 0).toLocaleString()}</TableCell>
              <TableCell className="text-right">{(article._count?.comments || 0).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}