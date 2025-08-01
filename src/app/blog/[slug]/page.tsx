import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, Clock, Tag, Share2, MessageSquare } from 'lucide-react';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';

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
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
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

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 2);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else {
      navigator.share?.({ title: post.title, text, url }).catch(() => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      });
    }
  };

  return (
    <article className="container relative max-w-4xl py-8 lg:py-12 mx-auto px-4">
      {/* Back Button */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to blog
          </Link>
        </Button>

        {/* Meta Information */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(parseISO(post.date), 'MMMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
          {post.tags && post.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {post.tags[0]}
              {post.tags.length > 1 && ` +${post.tags.length - 1} more`}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover aspect-video"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-700 dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-blockquote:border-l-blue-600 prose-blockquote:bg-gray-50 prose-blockquote:text-gray-800 dark:prose-blockquote:bg-gray-800/50 dark:prose-blockquote:text-gray-200 prose-code:rounded-md prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-gray-800 dark:prose-code:bg-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100">
        <div dangerouslySetInnerHTML={{ __html: post.body.code }} />
      </div>

      {/* Author Section */}
      <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <img
                src={post.author?.image || '/images/avatar.jpg'}
                alt={post.author?.name || 'Author'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {post.author?.name || 'Harshal Poojari'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {post.author?.role || 'Full Stack Developer'}
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Share:</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleShare('general')}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleShare('twitter')}
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              <span className="sr-only">Twitter</span>
            </Button>
          </div>
        </div>

        {/* Comment Button */}
        <div className="mt-8">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => alert('Comment functionality would be implemented here')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Leave a comment
          </Button>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            Related articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost._id}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500"
              >
                <div className="relative h-40">
                  <img
                    src={relatedPost.coverImage}
                    alt={relatedPost.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {format(parseISO(relatedPost.date), 'MMMM d, yyyy')} • {relatedPost.readingTime} min read
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
