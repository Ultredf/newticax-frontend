// src/components/dashboard/articles-table.tsx
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface ArticlesTableProps {
  articles: Article[];
  onToggleTrending: (id: string, isTrending: boolean) => void;
  onToggleBreaking: (id: string, isBreaking: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ArticlesTable({ 
  articles, 
  onToggleTrending, 
  onToggleBreaking, 
  onEdit, 
  onDelete 
}: ArticlesTableProps) {
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map(article => article.id));
    }
  };

  const toggleSelectArticle = (id: string) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(articleId => articleId !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">No articles found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedArticles.length === articles.length && articles.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Trending</TableHead>
            <TableHead>Breaking</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell>
                <Checkbox
                  checked={selectedArticles.includes(article.id)}
                  onCheckedChange={() => toggleSelectArticle(article.id)}
                  aria-label={`Select ${article.title}`}
                />
              </TableCell>
              <TableCell>
                <Link 
                  href={`/article/${article.slug}`} 
                  className="font-medium hover:text-blue-600 transition-colors"
                  target="_blank"
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
              <TableCell>
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Switch
                  checked={article.isTrending}
                  onCheckedChange={(checked) => onToggleTrending(article.id, checked)}
                  aria-label="Toggle trending"
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={article.isBreaking}
                  onCheckedChange={(checked) => onToggleBreaking(article.id, checked)}
                  aria-label="Toggle breaking"
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={article.published ? "success" : "secondary"}
                >
                  {article.published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onEdit(article.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="text-red-500 hover:text-red-700" 
                    onClick={() => onDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}