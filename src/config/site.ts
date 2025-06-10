export const siteConfig = {
  name: 'NewticaX',
  description: 'Your modern news platform with personalized content and multilingual support',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  author: 'NewticaX Team',
  keywords: [
    'news',
    'articles',
    'breaking news',
    'international news',
    'technology',
    'politics',
    'sports',
    'business',
    'multilingual news',
    'personalized news'
  ],
  creator: '@newticax',
  social: {
    twitter: 'https://twitter.com/newticax',
    facebook: 'https://facebook.com/newticax',
    instagram: 'https://instagram.com/newticax',
    linkedin: 'https://linkedin.com/company/newticax',
    youtube: 'https://youtube.com/c/newticax'
  },
  support: {
    email: 'support@newticax.com',
    phone: '+1 (555) 123-4567'
  },
  company: {
    name: 'NewticaX Inc.',
    address: '123 News Street, Jakarta, Indonesia',
    founded: '2024'
  }
} as const;
