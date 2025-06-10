import { 
  Home, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Search,
  Bookmark,
  User,
  Settings,
  LayoutDashboard,
  FileText,
  Users,
  Globe,
  RefreshCw,
  Bell,
  History,
  Tag
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  description?: string;
  external?: boolean;
  disabled?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Main navigation for header
export const mainNav: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Trending',
    href: '/trending',
    icon: TrendingUp,
  },
  {
    title: 'Latest',
    href: '/latest',
    icon: Clock,
  },
  {
    title: 'Breaking',
    href: '/breaking',
    icon: AlertTriangle,
  }
];

// Category navigation
export const categoryNav: NavItem[] = [
  {
    title: 'Technology',
    href: '/category/technology',
  },
  {
    title: 'Business',
    href: '/category/business',
  },
  {
    title: 'Sports',
    href: '/category/sports',
  },
  {
    title: 'Politics',
    href: '/category/politics',
  },
  {
    title: 'Entertainment',
    href: '/category/entertainment',
  },
  {
    title: 'Health',
    href: '/category/health',
  }
];

// User dashboard navigation
export const dashboardNav: NavSection[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and personalized content'
      },
      {
        title: 'Bookmarks',
        href: '/dashboard/bookmarks',
        icon: Bookmark,
        description: 'Your saved articles'
      },
      {
        title: 'Reading History',
        href: '/dashboard/reading-history',
        icon: History,
        description: 'Articles you\'ve read'
      },
      {
        title: 'Notifications',
        href: '/dashboard/notifications',
        icon: Bell,
        description: 'Your activity notifications'
      },
      {
        title: 'Profile Settings',
        href: '/dashboard/profile',
        icon: Settings,
        description: 'Manage your account'
      }
    ]
  }
];

// Admin navigation
export const adminNav: NavSection[] = [
  {
    title: 'Admin',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard/admin',
        icon: LayoutDashboard,
        description: 'Admin overview and statistics'
      },
      {
        title: 'Articles',
        href: '/dashboard/admin/articles',
        icon: FileText,
        description: 'Manage articles and content'
      },
      {
        title: 'Categories',
        href: '/dashboard/admin/categories',
        icon: Globe,
        description: 'Organize content categories'
      },
      {
        title: 'Tags',
        href: '/dashboard/admin/tags',
        icon: Tag,
        description: 'Manage article tags'
      },
      {
        title: 'Users',
        href: '/dashboard/admin/users',
        icon: Users,
        description: 'User management and roles'
      },
      {
        title: 'Sync News',
        href: '/dashboard/admin/sync',
        icon: RefreshCw,
        description: 'Import external news content'
      }
    ]
  }
];

// Footer navigation
export const footerNav: NavSection[] = [
  {
    title: 'Categories',
    items: [
      { title: 'Politics', href: '/category/politics' },
      { title: 'Business', href: '/category/business' },
      { title: 'Technology', href: '/category/technology' },
      { title: 'Sports', href: '/category/sports' },
      { title: 'Entertainment', href: '/category/entertainment' }
    ]
  },
  {
    title: 'Company',
    items: [
      { title: 'About Us', href: '/about' },
      { title: 'Contact', href: '/contact' },
      { title: 'Careers', href: '/careers', external: true },
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' }
    ]
  },
  {
    title: 'Resources',
    items: [
      { title: 'Help Center', href: '/help', external: true },
      { title: 'API Documentation', href: '/docs', external: true },
      { title: 'Status Page', href: '/status', external: true },
      { title: 'Blog', href: '/blog', external: true }
    ]
  }
];

// Mobile bottom navigation
export const mobileNav: NavItem[] = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    title: 'Bookmarks',
    href: '/dashboard/bookmarks',
    icon: Bookmark,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  }
];