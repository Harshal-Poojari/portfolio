import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, ArrowRight, Twitter, Facebook, Linkedin, Link as LinkIcon, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import ReactMarkdown from 'react-markdown';

// Utility classNames combiner
const cn = (...classes: (string | undefined | false | null)[]) => (
  classes.filter(Boolean).join(' ')
);

// Badge component with variants
const Badge = ({ 
  children, 
  variant = "secondary", 
  className = "",
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
  className?: string;
  [key: string]: any;
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    outline: 'bg-transparent border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant] || variantClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// PostMeta component for date and reading time
interface PostMetaProps {
  date: string;
  readTime?: number;
}

function PostMeta({ date, readTime = 5 }: PostMetaProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
      <span className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {format(parseISO(date), 'MMMM d, yyyy')}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {readTime} min read
      </span>
    </div>
  );
}

// SocialShareButtons Component for quick sharing
interface SocialShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, className = '' }) => {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const openShareWindow = (platform: keyof typeof shareUrls) => {
    window.open(
      shareUrls[platform],
      '_blank',
      'width=600,height=400,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className={cn('flex items-center gap-3 mt-4', className)}>
      <button
        aria-label="Share on Twitter"
        onClick={() => openShareWindow('twitter')}
        className="rounded p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        type="button"
      >
        <Twitter size={18} />
      </button>
      <button
        aria-label="Share on Facebook"
        onClick={() => openShareWindow('facebook')}
        className="rounded p-1 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        type="button"
      >
        <Facebook size={18} />
      </button>
      <button
        aria-label="Share on LinkedIn"
        onClick={() => openShareWindow('linkedin')}
        className="rounded p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        type="button"
      >
        <Linkedin size={18} />
      </button>
      <button
        aria-label="Copy link"
        onClick={() => {
          navigator.clipboard.writeText(url);
          alert('Link copied to clipboard');
        }}
        className="rounded p-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        type="button"
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
};

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    coverImage?: string;
    description?: string;
    tags?: string[];
    readTime?: number;
  };
  featured?: boolean;
  className?: string;
}

export function BlogCard({ post, featured = false, className }: BlogCardProps) {
  const {
    title,
    excerpt,
    slug,
    date,
    coverImage,
    description,
    tags = [],
    readTime = 5,
  } = post;

  const postUrl = `/blog/${slug}`;

  return (
    <article
      tabIndex={0}
      role="article"
      aria-labelledby={`post-title-${slug}`}
      aria-describedby={`post-excerpt-${slug}`}
      className={cn(
        'relative group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900',
        featured ? 'md:flex-row' : 'h-full',
        className
      )}
    >
      {/* Full clickable link overlay */}
      <Link
        to={postUrl}
        aria-label={`Read more about ${title}`}
        className="absolute inset-0 z-10"
      />

      {/* Cover Image with LazyLoad and blurred placeholder */}
      {coverImage && (
        <LazyLoad height={featured ? 200 : 192} offset={100} once placeholder={<div className={cn(featured ? "md:w-1/3" : "w-full h-48", "bg-gray-200 dark:bg-gray-700 animate-pulse rounded")} />}>
          <div
            className={cn(
              'relative overflow-hidden',
              featured ? 'md:w-1/3' : 'w-full h-48'
            )}
            style={!featured ? { height: '12rem' } : undefined}
          >
            <img
              loading="lazy"
              src={coverImage}
              alt={title}
              className={cn(
                'h-full w-full object-cover transition-transform duration-300',
                featured ? 'rounded-l-lg' : 'rounded-t-lg',
                'group-hover:scale-105'
              )}
              srcSet={`${coverImage}?w=320 320w, ${coverImage}?w=480 480w, ${coverImage}?w=800 800w`}
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
        </LazyLoad>
      )}

      {/* Content Area */}
      <div
        className={cn(
          'flex flex-1 flex-col p-6',
          featured && coverImage ? 'md:w-2/3' : undefined
        )}
      >
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs text-gray-500 dark:text-gray-400">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Title */}
        <h2
          id={`post-title-${slug}`}
          className="mb-3 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
        >
          {title}
        </h2>

        {/* Excerpt with markdown support */}
        <div id={`post-excerpt-${slug}`} className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 prose prose-indigo dark:prose-invert max-w-none" >
          <ReactMarkdown>{excerpt || description || ''}</ReactMarkdown>
        </div>

        {/* Meta info and Read more */}
        <div className="mt-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <PostMeta date={date} readTime={readTime} />
          <Link
            to={postUrl}
            className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Read more <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {/* Social Share Buttons */}
        <SocialShareButtons url={window.location.origin + postUrl} title={title} className="mt-4" />
      </div>
    </article>
  );
}
