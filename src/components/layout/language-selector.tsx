// src/components/layout/language-selector.tsx
'use client';

import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSelector() {
  const { language, setLanguage } = useAuthStore();
  
  const handleLanguageChange = (newLanguage: 'ENGLISH' | 'INDONESIAN') => {
    setLanguage(newLanguage);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" title={`Current language: ${language === 'ENGLISH' ? 'English' : 'Indonesian'}`}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ENGLISH')}
          className={language === 'ENGLISH' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('INDONESIAN')}
          className={language === 'INDONESIAN' ? 'bg-accent' : ''}
        >
          Indonesian (Bahasa)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}