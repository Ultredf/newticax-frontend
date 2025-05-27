// src/components/dashboard/preferences-form.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';
import { useAuthStore } from '@/store/auth-store';
import { updatePreferences } from '@/services/user-service';
import { getCategories } from '@/services/category-service';
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
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const preferencesSchema = z.object({
  language: z.enum(['ENGLISH', 'INDONESIAN']),
  categories: z.array(z.string()).optional(),
  notifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  emailUpdates: z.boolean().default(true),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface PreferencesFormProps {
  user: User;
  onSuccess?: () => void;
}

export function PreferencesForm({ user, onSuccess }: PreferencesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language, setLanguage } = useAuthStore();

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }),
  });

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      language: user.language || 'ENGLISH',
      categories: user.preference?.categories || [],
      notifications: user.preference?.notifications !== undefined ? user.preference.notifications : true,
      darkMode: user.preference?.darkMode !== undefined ? user.preference.darkMode : false,
      emailUpdates: user.preference?.emailUpdates !== undefined ? user.preference.emailUpdates : true,
    },
  });

  // Update form when user changes
  useEffect(() => {
    form.reset({
      language: user.language || 'ENGLISH',
      categories: user.preference?.categories || [],
      notifications: user.preference?.notifications !== undefined ? user.preference.notifications : true,
      darkMode: user.preference?.darkMode !== undefined ? user.preference.darkMode : false,
      emailUpdates: user.preference?.emailUpdates !== undefined ? user.preference.emailUpdates : true,
    });
  }, [user, form]);

  const onSubmit = async (data: PreferencesFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Update language if changed
      if (data.language !== language) {
        await setLanguage(data.language);
      }
      
      // Update other preferences
      await updatePreferences({
        categories: data.categories || [],
        notifications: data.notifications,
        darkMode: data.darkMode,
        emailUpdates: data.emailUpdates,
      });
      
      toast.success('Preferences updated successfully');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCategoriesLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Language</FormLabel>
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
                Content will be prioritized in your preferred language
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Categories of Interest</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoriesData?.data.map((category) => (
              <FormField
                key={category.id}
                control={form.control}
                name="categories"
                render={({ field }) => {
                  const isSelected = field.value?.includes(category.id);
                  return (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4"
                          checked={isSelected}
                          onChange={(e) => {
                            const value = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...value, category.id]);
                            } else {
                              field.onChange(value.filter((id) => id !== category.id));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        {category.name}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notifications & Appearance</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="cursor-pointer">Notifications</FormLabel>
                    <FormDescription>Receive activity notifications</FormDescription>
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
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="cursor-pointer">Dark Mode</FormLabel>
                    <FormDescription>Use dark theme</FormDescription>
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
              name="emailUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="cursor-pointer">Email Updates</FormLabel>
                    <FormDescription>Receive news digests and updates</FormDescription>
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
     </Form>
  );
}