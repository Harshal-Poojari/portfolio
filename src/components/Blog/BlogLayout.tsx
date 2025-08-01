import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BlogSidebar } from './BlogSidebar';
import { cn } from '@/lib/utils';


interface BlogLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  categories?: Array<{ name: string; count: number; slug: string }>;
  tags?: Array<{ name: string; count: number; slug: string }>;
  activeCategory?: string | null;
  activeTag?: string | null;
  className?: string;
  sidebar?: boolean;
}


export function BlogLayout({
  children,
  title = 'Blog',
  description = 'Thoughts, stories and ideas about web development, design, and more.',
  categories = [],
  tags = [],
  activeCategory = null,
  activeTag = null,
  className,
  sidebar = true,
}: BlogLayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | My Blog`}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="bg-white dark:bg-gray-900">
        {/* Blog Header */}
        <div className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/40">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Breadcrumb */}
              {(activeCategory || activeTag) && (
                <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <ol className="inline-flex items-center space-x-1 justify-center">
                    <li>
                      <Link href="/blog" className="hover:underline">
                        Blog
                      </Link>
                    </li>
                    {activeCategory && (
                      <li>
                        <span className="mx-1">/</span>
                        <Link href={`/blog/category/${activeCategory}`} className="hover:underline capitalize">
                          {activeCategory}
                        </Link>
                      </li>
                    )}
                    {activeTag && (
                      <li>
                        <span className="mx-1">/</span>
                        <Link href={`/blog/tag/${activeTag}`} className="hover:underline capitalize">
                          {activeTag}
                        </Link>
                      </li>
                    )}
                  </ol>
                </nav>
              )}

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {title}
              </h1>
              {description && (
                <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main 
          role="main"
          className={cn(
            'mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8',
            className
          )}
        >
          <div
            className={cn(
              'grid gap-12',
              sidebar ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
            )}
          >
            <div className={cn('space-y-12', sidebar && 'lg:col-span-2')}>
              {children}
            </div>

            {/* Sidebar */}
            {sidebar && (
              <aside className="lg:col-span-1 sticky top-20 self-start" role="complementary" aria-label="Blog sidebar">
                <BlogSidebar
                  categories={categories}
                  tags={tags}
                  activeCategory={activeCategory}
                  activeTag={activeTag}
                />
              </aside>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
