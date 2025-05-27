import parse from 'html-react-parser';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none mb-8">
      {parse(content)}
    </div>
  );
}