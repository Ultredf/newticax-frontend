'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { getCategories } from '@/services/category-service';
import { createArticle, updateArticle } from '@/services/article-service';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Article } from '@/types';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  summary: z.string().min(20, 'Summary must be at least 20 characters long').max(300, 'Summary must be less than 300 characters'),
  content: z.string().min(100, 'Content must be at least 100 characters long'),
  image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  categoryId: z.string().optional(),
  isBreaking: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  published: z.boolean().default(true),
  language: z.enum(['ENGLISH', 'INDONESIAN']),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleEditorProps {
  article?: Article;
  isEdit?: boolean;
}

export function ArticleEditor({ article, isEdit = false }: ArticleEditorProps) {
  const [editorContent, setEditorContent] = useState('');
  const router = useRouter();
  const { language } = useAuthStore();

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['editorCategories'],
    queryFn: () => getCategories({ limit: 100 }),
  });

  // Initialize form with article data if editing
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title || '',
      summary: article?.summary || '',
      content: article?.content || '',
      image: article?.image || '',
      categoryId: article?.categoryId || '',
      isBreaking: article?.isBreaking || false,
      isTrending: article?.isTrending || false,
      published: article?.published !== undefined ? article.published : true,
      language: article?.language || language,
    }
  });

  // Update form values when article changes
  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        summary: article.summary,
        content: article.content,
        image: article.image || '',
        categoryId: article.categoryId || '',
        isBreaking: article.isBreaking,
        isTrending: article.isTrending,
        published: article.published,
        language: article.language,
      });
      setEditorContent(article.content);
    }
  }, [article, form]);

  // Update form content field when editor content changes
  useEffect(() => {
    form.setValue('content', editorContent);
  }, [editorContent, form]);

  // Handle form submission
  const onSubmit = async (values: ArticleFormValues) => {
    try {
      if (isEdit && article) {
        // Update existing article
        await updateArticle(article.id, values);
        toast.success('Article updated successfully');
      } else {
        // Create new article
        await createArticle(values);
        toast.success('Article created successfully');
      }
      router.push('/dashboard/admin/articles');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update article' : 'Failed to create article');
    }
  };

  // React Quill toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
    ],
  };

  const isLoading = isCategoriesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief summary of the article (will be shown in previews)" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categoriesData?.data.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="min-h-[400px]">
                      {typeof window !== 'undefined' && (
                        <ReactQuill
                          theme="snow"
                          value={editorContent}
                          onChange={setEditorContent}
                          modules={modules}
                          className="h-[350px] mb-12"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ENGLISH">English</SelectItem>
                        <SelectItem value="INDONESIAN">Indonesian</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Published
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Make article visible to readers
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="isBreaking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Breaking News
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Mark as breaking news
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isTrending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Trending
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Mark as trending
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/dashboard/admin/articles')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting 
                  ? isEdit ? 'Updating...' : 'Publishing...' 
                  : isEdit ? 'Update Article' : 'Publish Article'
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}