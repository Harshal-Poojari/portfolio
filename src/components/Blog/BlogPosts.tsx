import React from 'react';
import { BlogCard } from './BlogCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BlogPostsProps {
  posts: Array<{
  id?: string;
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    coverImage?: string;
    description?: string;
    tags?: string[];
    readTime?: number;
  }>;
  className?: string;
  featuredPostId?: string;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalPosts?: number; // optional for display total results count
  isLoading?: boolean; // optional for loading state on pagination
}

export function BlogPosts({
  posts = [],
  className,
  featuredPostId,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalPosts,
  isLoading = false,
}: BlogPostsProps) {
  const featuredPost = featuredPostId
    ? posts.find((post) => post._id === featuredPostId)
    : null;

  const regularPosts = featuredPostId
    ? posts.filter((post) => post._id !== featuredPostId)
    : posts;

  // Helper: Generate page numbers to display in pagination
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('space-y-12', className)}>
      {/* Featured Post */}
      {featuredPost && (
        <section aria-labelledby="featured-posts-heading" className="mb-12">
          <h2
            id="featured-posts-heading"
            className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Featured Post
          </h2>
          <BlogCard post={featuredPost} featured />
        </section>
      )}

      {/* Regular Posts Grid */}
      <section aria-label="Blog posts listing">
        {regularPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center"
            role="alert"
            aria-live="polite"
          >
            <p className="text-lg font-medium">No posts found</p>
            <p className="mt-2">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            {onPageChange && (
              <Button
                variant="link"
                className="mt-4"
                onClick={() => onPageChange(1)}
                aria-label="Reset to first page"
              >
                Reset Filters
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Optional Total Posts Count */}
      {totalPosts !== undefined && totalPosts !== posts.length && (
        <p
          className={cn(
            'text-sm text-gray-600 dark:text-gray-400 mt-4',
            totalPosts === 0 && 'hidden'
          )}
          aria-live="polite"
        >
          Showing {posts.length} of {totalPosts} posts
        </p>
      )}

      {/* Pagination Controls */}
      {showPagination && totalPages > 1 && (
        <>
          {/* Mobile Pagination - only Previous/Next */}
          <nav
            aria-label="Pagination"
            className="flex justify-between items-center space-x-4 px-1 sm:hidden mt-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-disabled={currentPage <= 1}
              aria-label="Previous Page"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-disabled={currentPage >= totalPages}
              aria-label="Next Page"
            >
              Next
            </Button>
          </nav>

          {/* Desktop Pagination */}
          <nav
            aria-label="Pagination"
            className="hidden sm:flex justify-center items-center space-x-2 mt-8"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-disabled={currentPage <= 1}
              aria-label="Previous Page"
            >
              Previous
            </Button>

            {pageNumbers.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange?.(pageNum)}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </Button>
            ))}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                <Button
                  variant={totalPages === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(totalPages)}
                  aria-current={totalPages === currentPage ? 'page' : undefined}
                  aria-label={`Page ${totalPages}`}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-disabled={currentPage >= totalPages}
              aria-label="Next Page"
            >
              Next
            </Button>
          </nav>
        </>
      )}

      {/* Loading indicator next to pagination buttons if fetching */}
      {isLoading && (
        <p
          className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          Loading posts...
        </p>
      )}
    </div>
  );
}
