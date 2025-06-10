'use client';

import { useState } from 'react';
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

interface SearchFiltersProps {
  categories?: Array<{ id: string; name: string; }>;
  selectedCategory?: string;
  selectedDateRange?: { from?: Date; to?: Date };
  selectedSort?: 'relevance' | 'date' | 'popularity';
  onCategoryChange?: (category: string) => void;
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void;
  onSortChange?: (sort: 'relevance' | 'date' | 'popularity') => void;
  onClearFilters?: () => void;
}

export function SearchFilters({
  categories = [],
  selectedCategory,
  selectedDateRange,
  selectedSort = 'relevance',
  onCategoryChange,
  onDateRangeChange,
  onSortChange,
  onClearFilters
}: SearchFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(
    selectedDateRange || {}
  );

  const hasActiveFilters = selectedCategory || selectedDateRange?.from || selectedSort !== 'relevance';

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Category Filter */}
        {categories.length > 0 && (
          <Select value={selectedCategory || ''} onValueChange={onCategoryChange}>
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
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
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
            />
          </PopoverContent>
        </Popover>

        {/* Sort Filter */}
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="date">Latest</SelectItem>
            <SelectItem value="popularity">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge variant="secondary">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => onCategoryChange?.('')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {selectedDateRange?.from && (
            <Badge variant="secondary">
              {selectedDateRange.to ? 'Date Range' : 'From Date'}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => handleDateRangeChange({})}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {selectedSort !== 'relevance' && (
            <Badge variant="secondary">
              Sort: {selectedSort}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => onSortChange?.('relevance')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}