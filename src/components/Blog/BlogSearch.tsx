'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
      "dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
);

interface BlogSearchProps {
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  debounceMs?: number;
  onSearchChange?: (searchTerm: string) => void;
}

export function BlogSearch({
  placeholder = 'Search articles...',
  className,
  defaultValue = '',
  debounceMs = 300,
  onSearchChange,
}: BlogSearchProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from defaultValue or URL param
  const initialSearch = searchParams.get('search') ?? defaultValue;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);

  // Sync internal state if URL param changes externally (e.g., browser back/forward)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    // We intentionally exclude searchTerm to avoid infinite loops and allow URL-driven update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounced URL update and external callback
  useEffect(() => {
    // Skip if searchTerm and URL are already in sync, no need to do extra routing
    const currentParam = searchParams.get('search') ?? '';
    if (searchTerm.trim() === currentParam.trim()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      setIsLoading(false);
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm.trim() !== '') {
        params.set('search', searchTerm.trim());
      } else {
        params.delete('search');
      }

      // Update URL without scrolling or adding to history stack
      router.replace(`/blog?${params.toString()}`, { scroll: false });

      // fire optional callback
      if (onSearchChange) {
        onSearchChange(searchTerm.trim());
      }
    }, debounceMs);

    // Clear timeout if searchTerm changes before debounceMs
    return () => clearTimeout(handler);
  }, [searchTerm, debounceMs, onSearchChange, router, searchParams]);

  // Sync if defaultValue changes externally at any time
  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setSearchTerm('');
    }
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search
          className={cn(
            "h-4 w-4 transition-colors",
            isLoading ? "text-blue-500" : "text-gray-400"
          )}
          aria-hidden="true"
        />
      </div>

      {/* Input */}
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="rounded-md pl-10 pr-10"
        aria-label="Search articles"
        autoComplete="off"
        spellCheck={false}
      />

      {/* Clear button */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-y-0 right-10 flex items-center">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}
    </div>
  );
}

// Optional hook for external components wanting controlled search state
export function useBlogSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get('search') ?? '';

  // Update the search param reactively
  const setSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term.trim()) {
      params.set('search', term.trim());
    } else {
      params.delete('search');
    }

    router.replace(`/blog?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, [setSearch]);

  return {
    searchTerm,
    setSearch,
    clearSearch,
  };
}
