import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, X, Tag, Clock, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/api';

// Simple utility function
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Simple Button component
const Button = ({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "",
  asChild = false,
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
  };
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 py-1",
    icon: "h-10 w-10"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    const child = children as React.ReactElement;
    return {
      ...child,
      props: {
        ...child.props,
        className: `${child.props.className || ''} ${classes}`.trim(),
        onClick,
        ...props
      }
    };
  }
  
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

// Simple Badge component
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200 ${className}`}>
    {children}
  </span>
);

// Simple Input component
const Input = ({ className = "", ...props }: { className?: string; [key: string]: any }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 ${className}`}
    {...props}
  />
);

// Simple BlogCard component
const BlogCard = ({ post, featured = false }: { post: any; featured?: boolean }) => (
  <article className={cn(
    'group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900',
    featured ? 'md:flex-row' : 'h-full'
  )}>
    {post.coverImage && (
      <div className={cn(
        'relative overflow-hidden',
        featured ? 'h-48 md:h-auto md:w-1/3' : 'h-48'
      )}>
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    )}
    
    <div className={cn(
      'flex flex-1 flex-col p-6',
      featured && post.coverImage ? 'md:w-2/3' : ''
    )}>
      {post.tags && post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge className="text-gray-500 dark:text-gray-400">
              +{post.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}
      
      <h2 className="mb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:text-blue-600 hover:no-underline dark:hover:text-blue-400 transition-colors duration-200"
        >
          {post.title}
        </Link>
      </h2>
      
      <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
        {post.description || post.excerpt}
      </p>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            {post.readingTime || post.readTime || 5} min read
          </span>
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Read more →
        </Link>
      </div>
    </div>
  </article>
);

// Simple BlogSearch component
const BlogSearch = ({ defaultValue }: { defaultValue?: string }) => (
  <Input
    type="search"
    placeholder="Search articles..."
    defaultValue={defaultValue}
    className="pl-10"
  />
);

export const metadata: Metadata = {
  title: 'Blog | Harshal Poojari - Web & Game Development Articles',
  description: 'Explore in-depth articles on web development, game design, AI, and programming. Learn from tutorials, insights, and technical deep dives by Harshal Poojari.',
  keywords: [
    'web development blog',
    'game development tutorials',
    'AI programming',
    'React',
    'Next.js',
    'Unity',
    'JavaScript',
    'TypeScript',
    'technical blog',
    'programming tutorials'
  ],
  openGraph: {
    title: 'Blog | Harshal Poojari - Web & Game Development Articles',
    description: 'Explore in-depth articles on web development, game design, AI, and programming. Learn from tutorials, insights, and technical deep dives by Harshal Poojari.',
    url: 'https://letsmakeai.com/blog',
    type: 'website',
    siteName: 'Harshal Poojari Portfolio',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Harshal Poojari - Web & Game Development',
    description: 'Technical articles and tutorials on web development, game design, and AI programming.',
  },
};

type SearchParams = {
  search?: string;
  tag?: string;
  category?: string;
  sort?: 'newest' | 'oldest' | 'popular';
};

// Filter Badge Component
function FilterBadge({ label, href }: { label: string; href: string }) {
  return (
    <Badge className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
      {label}
      <Link
        href={href}
        className="ml-1 rounded-full p-0.5 hover:bg-gray-300/50 dark:hover:bg-gray-600/50"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </Link>
    </Badge>
  );
}

import type { Post } from '@/lib/api';

// Helper type to handle the body content
type PostWithSearchableBody = Post & {
  // Ensure we can search through the body content
  body: any; // We'll handle the body content dynamically
  // Add any additional properties we need for the UI
  excerpt?: string;
  views?: number;
  featured?: boolean;
  coverImage?: string;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, tag, category, sort = 'newest' } = searchParams;
  
  // Get all posts with filters applied using the API
  let posts: PostWithSearchableBody[] = await getAllPosts({ tag: tag || '', category: category || '' });
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter((post) => {
      // Handle different possible body formats
      let bodyText = '';
      if (Array.isArray(post.body)) {
        bodyText = post.body
          .map((block: any) => 
            (block.children || [])
              .map((child: any) => child.text || '')
              .join('')
          )
          .join(' ');
      } else if (typeof post.body === 'string') {
        bodyText = post.body;
      }
      
      return (
        post.title.toLowerCase().includes(searchLower) ||
        (post.description?.toLowerCase().includes(searchLower) ?? false) ||
        (post.excerpt?.toLowerCase().includes(searchLower) ?? false) ||
        (post.tags?.some((t: string) => t.toLowerCase().includes(searchLower)) ?? false) ||
        bodyText.toLowerCase().includes(searchLower)
      );
    });
  }

  // Sort posts
  const sortedPosts = [...posts];
  if (sort === 'oldest') {
    sortedPosts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  } else if (sort === 'popular') {
    sortedPosts.sort((a, b) => {
      const aScore = (a.views || 0) + new Date(a.publishedAt).getTime() / 10000000000;
      const bScore = (b.views || 0) + new Date(b.publishedAt).getTime() / 10000000000;
      return bScore - aScore;
    });
  } else {
    // Default: newest first
    sortedPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // Get featured posts (first 2 posts with featured: true)
  const featuredPosts = sortedPosts.filter((post) => post.featured).slice(0, 2);
  
  // Get all other posts (non-featured or beyond the first 2 featured)
  const regularPosts = sortedPosts.filter(
    (post, _index) => !post.featured || (post.featured && !featuredPosts.includes(post))
  );
  // Get all tags and categories using the API
  const [allTags, allCategories] = await Promise.all([
    getAllTags(),
    getAllCategories()
  ]);
  
  // Check if filtering
  const isFiltered = Boolean(search || tag || category);

  // Helper function to build URLs
  const buildUrl = (params: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    const query = urlParams.toString();
    return `/blog${query ? `?${query}` : ''}`;
  };

  return (
    <div className="container relative py-8 lg:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900 dark:text-white">
                Blog
              </h1>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
                Thoughts, stories, and insights on web development, design, and more.
              </p>
            </div>
            
            <div className="w-full sm:w-auto">
              <Button asChild variant="outline">
                <Link href="/blog/subscribe" className="flex items-center gap-2">
                  <span>Subscribe to Newsletter</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="space-y-4 pt-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Suspense fallback={<Input placeholder="Search articles..." className="pl-10" />}>
                <BlogSearch defaultValue={search || ''} />
              </Suspense>
            </div>
            
            {/* Active filters */}
            {(tag || category) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
                {tag && (
                  <FilterBadge 
                    label={`Tag: ${tag}`}
                    href={buildUrl({ search, category, sort })}
                  />
                )}
                {category && (
                  <FilterBadge 
                    label={`Category: ${category}`}
                    href={buildUrl({ search, tag, sort })}
                  />
                )}
                <Link 
                  href="/blog" 
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            {/* Sort Options */}
            <div className="mb-6 flex gap-2 overflow-x-auto">
              <Link 
                href={buildUrl({ search, tag, category, sort: 'newest' })}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === 'newest' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Newest
              </Link>
              <Link 
                href={buildUrl({ search, tag, category, sort: 'popular' })}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === 'popular' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Popular
              </Link>
              <Link 
                href={buildUrl({ search, tag, category, sort: 'oldest' })}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sort === 'oldest' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Oldest
              </Link>
            </div>

            {/* Results Info */}
            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              {isFiltered ? (
                <p>Found {posts.length} {posts.length === 1 ? 'article' : 'articles'} {search && `for "${search}"`}</p>
              ) : (
                <p>Showing all {posts.length} {posts.length === 1 ? 'article' : 'articles'}</p>
              )}
            </div>

            {/* Featured Posts */}
            {!isFiltered && featuredPosts.length > 0 && (
              <section className="mb-12 space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Featured Posts
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post._id} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Regular Posts */}
            <div className="space-y-6">
              {regularPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {/* No posts found */}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {search ? `No articles found for "${search}".` : 'No articles match your current filters.'}
                </p>
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors duration-200"
                >
                  View all posts
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full space-y-6 lg:w-1/3 lg:pl-8">
            {/* Newsletter Signup */}
            <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Subscribe to my newsletter</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Get the latest posts delivered right to your inbox.
              </p>
              <Button asChild className="w-full">
                <Link href="/blog/subscribe">
                  Subscribe
                </Link>
              </Button>
            </div>
            
            {/* Popular Tags */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map((tagItem) => (
                  <Link
                    key={tagItem.name}
                    href={buildUrl({ search, category, sort, tag: tagItem.name })}
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors',
                      tag === tagItem.name 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    {tagItem.name} <span className="ml-1 text-xs opacity-70">({tagItem.count})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                {allCategories.map((categoryItem) => (
                  <Link
                    key={categoryItem.name}
                    href={buildUrl({ search, tag, sort, category: categoryItem.name })}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      category === categoryItem.name
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    {categoryItem.name} ({categoryItem.count})
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
              <div className="space-y-3">
                {posts
                  .slice(0, 3)
                  .map((recentPost) => (
                    <Link
                      key={recentPost._id}
                      href={`/blog/${recentPost.slug}`}
                      className="block group"
                    >
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                        {recentPost.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(recentPost.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
