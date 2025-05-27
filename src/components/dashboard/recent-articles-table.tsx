// src/components/dashboard/recent-articles-table.tsx
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
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

interface RecentArticlesTableProps {
  articles: Article[];
}

export function RecentArticlesTable({ articles }: RecentArticlesTableProps) {
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
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell>{article.author?.name || 'Unknown'}</TableCell>
              <TableCell>
                {article.category ? (
                  <Badge variant="outline">{article.category.name}</Badge>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">Uncategorized</span>
                )}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Badge
                  variant={article.published ? "success" : "secondary"}
                >
                  {article.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}