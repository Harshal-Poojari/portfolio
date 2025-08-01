import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CustomLink } from '@/components/ui/link';
import { cn } from '@/lib/utils';
import NewsletterSignup from './NewsletterSignup'; // Adjust path accordingly

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface Tag {
  name: string;
  count: number;
  slug: string;
}

interface BlogSidebarProps {
  categories: Category[];
  tags: Tag[];
  className?: string;
  activeCategory?: string | null;
  activeTag?: string | null;
}

export function BlogSidebar({
  categories = [],
  tags = [],
  className,
  activeCategory,
  activeTag,
}: BlogSidebarProps) {
  return (
    <aside
      className={cn('space-y-8', className)}
      aria-label="Blog sidebar"
    >
      {/* Categories Section */}
      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Categories
          </h2>
          <ul className="space-y-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.slug;
              return (
                <li key={category.slug}>
                  <CustomLink
                    href={`/blog/category/${category.slug}`}
                    className={cn(
                      'flex justify-between items-center rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </CustomLink>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Tags Section */}
      {tags.length > 0 && (
        <nav aria-label="Blog tags" className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tags
          </h2>
          <ul className="flex flex-wrap gap-2 max-h-48 overflow-y-auto" role="list">
            {tags.map((tag) => {
              const isActive = activeTag === tag.slug;
              return (
                <li key={tag.slug} role="listitem">
                  <CustomLink
                    href={`/blog/tag/${tag.slug}`}
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-xs transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {tag.name}
                    <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                      {tag.count}
                    </span>
                  </CustomLink>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </aside>
  );
}
