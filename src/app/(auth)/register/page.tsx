'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// FIXED: Schema yang konsisten tanpa optional untuk language
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be less than 30 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: 'Username can only contain letters, numbers, and underscores' 
    }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  language: z.enum(['ENGLISH', 'INDONESIAN']), // FIXED: Removed .default() and .optional()
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, error, clearError } = useAuthStore();
  
  // Redirect if already authenticated
  useAuth({
    redirectIfAuthenticated: true,
    redirectAuthenticatedTo: '/dashboard',
  });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      language: 'ENGLISH', // FIXED: Set explicit default value
    },
  });

  // Clear any previous errors when form is loaded
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // Data sudah valid dan konsisten, kirim langsung
      await register(data);
      toast.success('Registration successful');
    } catch (err) {
      // Error is handled by the auth store and displayed below
      console.error('Registration failed:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Join NewticaX to stay updated with the latest news</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <strong>All fields are required.</strong> Please fill in your complete information to create your account.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name (e.g., John Doe)" 
                      {...field} 
                      className="bg-blue-50 dark:bg-blue-900/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Choose a unique username (e.g., johndoe123)" 
                      {...field}
                      className="bg-blue-50 dark:bg-blue-900/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email address (e.g., john@example.com)" 
                      type="email" 
                      {...field}
                      className="bg-blue-50 dark:bg-blue-900/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Create a strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)" 
                      type="password" 
                      {...field}
                      className="bg-blue-50 dark:bg-blue-900/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Language *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} // FIXED: Use value instead of defaultValue
                  >
                    <FormControl>
                      <SelectTrigger className="bg-blue-50 dark:bg-blue-900/20">
                        <SelectValue placeholder="Select your preferred language" />
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

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </Form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full"
              disabled
            >
              Google (Coming Soon)
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGithubLogin}
              className="w-full"
              disabled
            >
              GitHub (Coming Soon)
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
