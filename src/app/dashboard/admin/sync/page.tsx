'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { syncNewsAPI } from '@/services/admin-service';
import { getCategories } from '@/services/category-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const syncFormSchema = z.object({
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  language: z.enum(['ENGLISH', 'INDONESIAN']),
});

type SyncFormValues = z.infer<typeof syncFormSchema>;

// NewsAPI category mapping
const NEWS_API_CATEGORIES = [
  { id: 'general', label: 'General', description: 'General news and current events' },
  { id: 'business', label: 'Business', description: 'Business and financial news' },
  { id: 'technology', label: 'Technology', description: 'Technology and innovation news' },
  { id: 'entertainment', label: 'Entertainment', description: 'Entertainment and celebrity news' },
  { id: 'health', label: 'Health', description: 'Health and medical news' },
  { id: 'science', label: 'Science', description: 'Science and research news' },
  { id: 'sports', label: 'Sports', description: 'Sports news and updates' },
];

export default function SyncNewsAPIPage() {
  const [syncResult, setSyncResult] = useState<{
    totalSynced: number;
    errors: string[] | null;
  } | null>(null);
  
  // Verify admin access
  useAuth({
    requireAuth: true,
    requireAdmin: true,
    redirectTo: '/dashboard',
  });

  // Fetch existing categories from database
  const { 
    data: existingCategories, 
    isLoading: isCategoriesLoading,
    refetch: refetchCategories 
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }),
  });

  // Form setup
  const form = useForm<SyncFormValues>({
    resolver: zodResolver(syncFormSchema),
    defaultValues: {
      categories: ['general'],
      language: 'ENGLISH',
    },
  });

  // Sync mutation
  const { mutate, isPending } = useMutation({
    mutationFn: syncNewsAPI,
    onSuccess: (data) => {
      toast.success(`Successfully synced ${data.totalSynced} articles`);
      setSyncResult(data);
      // Refetch categories in case new ones were created during sync
      refetchCategories();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to sync news from API');
    },
  });

  // Handle form submission
  const onSubmit = (values: SyncFormValues) => {
    // Reset previous result
    setSyncResult(null);
    
    // Run sync
    mutate(values);
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sync External News</h1>
        <p className="text-muted-foreground">
          Import news articles from external NewsAPI.org based on categories and language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sync Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              NewsAPI Sync
            </CardTitle>
            <CardDescription>
              Import news articles from NewsAPI.org based on categories and language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormDescription>
                        Select the language for imported articles
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>NewsAPI Categories</FormLabel>
                        <FormDescription>
                          Select categories to import from NewsAPI
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {NEWS_API_CATEGORIES.map((category) => (
                          <FormField
                            key={category.id}
                            control={form.control}
                            name="categories"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={category.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(category.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, category.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== category.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium cursor-pointer">
                                      {category.label}
                                    </FormLabel>
                                    <FormDescription className="text-xs">
                                      {category.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Syncing...
                    </>
                  ) : (
                    'Start Sync'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Sync Results */}
        <Card>
          <CardHeader>
            <CardTitle>Sync Results</CardTitle>
            <CardDescription>
              Results of the latest sync operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {syncResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-medium">Sync completed successfully</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p><strong>Articles Imported:</strong> {syncResult.totalSynced}</p>
                  
                  {syncResult.errors && syncResult.errors.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-red-500 flex items-center gap-1 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Sync Errors:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {syncResult.errors.map((error, index) => (
                          <li key={index} className="text-red-500">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <RefreshCw className="h-8 w-8 mb-2" />
                <p>No recent sync results</p>
                <p className="text-sm mt-2">Run a sync to see results here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Categories Info */}
      {existingCategories?.data && existingCategories.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
            <CardDescription>
              Categories currently available in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {existingCategories.data.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {category._count?.articles || 0} articles
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}