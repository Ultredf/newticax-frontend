// src/hooks/use-translations.ts
import { useAuthStore } from '@/store/auth-store';
import { t } from '@/lib/translations';

export function useTranslations() {
  const { language } = useAuthStore();
  
  return {
    t: (key: string) => t(key, language),
    language
  };
}