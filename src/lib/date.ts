import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { enUS, id } from 'date-fns/locale';

export const LOCALES = {
  ENGLISH: enUS,
  INDONESIAN: id,
};

export function formatDate(
  date: string | Date,
  formatStr: string = 'PPP',
  language: 'ENGLISH' | 'INDONESIAN' = 'ENGLISH'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    return format(dateObj, formatStr, {
      locale: LOCALES[language],
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

export function formatRelativeDate(
  date: string | Date,
  language: 'ENGLISH' | 'INDONESIAN' = 'ENGLISH'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: LOCALES[language],
    });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
}

export function isRecentDate(date: string | Date, hoursThreshold: number = 24): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return false;
    }

    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
    
    return diffInHours <= hoursThreshold;
  } catch (error) {
    return false;
  }
}