'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Interface for category
interface Category {
  id: string;
  name: string;
  slug?: string;
}

// Interface for date range that matches our usage
interface SearchDateRange {
  from?: Date;
  to?: Date;
}

interface SearchFiltersProps {
  categories?: Category[];
  selectedCategory?: string;
  selectedDateRange?: SearchDateRange;
  selectedSort?: 'relevance' | 'date' | 'popularity';
  selectedLanguage?: 'ENGLISH' | 'INDONESIAN';
  onCategoryChange?: (category: string) => void;
  onDateRangeChange?: (range: SearchDateRange) => void;
  onSortChange?: (sort: 'relevance' | 'date' | 'popularity') => void;
  onLanguageChange?: (language: 'ENGLISH' | 'INDONESIAN') => void;
  onClearFilters?: () => void;
  isLoading?: boolean;
  totalResults?: number;
}

export function SearchFilters({
  categories = [],
  selectedCategory,
  selectedDateRange,
  selectedSort = 'relevance',
  selectedLanguage = 'ENGLISH',
  onCategoryChange,
  onDateRangeChange,
  onSortChange,
  onLanguageChange,
  onClearFilters,
  isLoading = false,
  totalResults
}: SearchFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    // Convert SearchDateRange to DateRange for Calendar component
    if (selectedDateRange?.from || selectedDateRange?.to) {
      return {
        from: selectedDateRange.from,
        to: selectedDateRange.to,
      } as DateRange;
    }
    return undefined;
  });

  // Update local state when props change
  useEffect(() => {
    if (selectedDateRange?.from || selectedDateRange?.to) {
      setDateRange({
        from: selectedDateRange.from,
        to: selectedDateRange.to,
      } as DateRange);
    } else {
      setDateRange(undefined);
    }
  }, [selectedDateRange]);

  const hasActiveFilters = 
    selectedCategory || 
    selectedDateRange?.from || 
    selectedSort !== 'relevance' ||
    selectedLanguage !== 'ENGLISH';

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    // Convert DateRange back to SearchDateRange for parent component
    const searchRange: SearchDateRange = {
      from: range?.from,
      to: range?.to,
    };
    
    onDateRangeChange?.(searchRange);
  };

  const clearDateRange = () => {
    setDateRange(undefined);
    onDateRangeChange?.({});
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick a date range";
    
    if (range.to) {
      return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`;
    }
    
    return format(range.from, "LLL dd, y");
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    return categories.find(c => c.id === selectedCategory)?.name || selectedCategory;
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'relevance': return 'Relevance';
      case 'date': return 'Latest';
      case 'popularity': return 'Popular';
      default: return sort;
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'ENGLISH': return 'English';
      case 'INDONESIAN': return 'Indonesian';
      default: return language;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
          {totalResults !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({totalResults.toLocaleString()} results)
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            disabled={isLoading}
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        {categories.length > 0 && (
          <Select 
            value={selectedCategory || ''} 
            onValueChange={onCategoryChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-[240px] justify-start text-left font-normal"
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange(dateRange)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              disabled={(date) => 
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </PopoverContent>
        </Popover>

        {/* Sort Filter */}
        <Select 
          value={selectedSort} 
          onValueChange={onSortChange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Latest</SelectItem>
            <SelectItem value="popularity">Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* Language Filter */}
        {onLanguageChange && (
          <Select 
            value={selectedLanguage} 
            onValueChange={onLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ENGLISH">English</SelectItem>
              <SelectItem value="INDONESIAN">Indonesian</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category: {getSelectedCategoryName()}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => onCategoryChange?.('')}
                  disabled={isLoading}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {selectedDateRange?.from && (
              <Badge variant="secondary" className="gap-1">
                {selectedDateRange.to ? 'Date Range' : 'From Date'}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={clearDateRange}
                  disabled={isLoading}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {selectedSort !== 'relevance' && (
              <Badge variant="secondary" className="gap-1">
                Sort: {getSortLabel(selectedSort)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => onSortChange?.('relevance')}
                  disabled={isLoading}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            
            {selectedLanguage !== 'ENGLISH' && (
              <Badge variant="secondary" className="gap-1">
                Language: {getLanguageLabel(selectedLanguage)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => onLanguageChange?.('ENGLISH')}
                  disabled={isLoading}
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Applying filters...
        </div>
      )}
    </div>
  );
}

// Export types for external use
export type { SearchDateRange, Category };