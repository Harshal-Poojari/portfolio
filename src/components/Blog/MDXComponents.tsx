'use client';

import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { ReactNode } from 'react';

// Simple utility function (to avoid external dependency)
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Define types for our components
type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  [key: string]: any;
};

// Counter component for interactive examples
const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="flex items-center gap-4 p-4 my-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <button 
        onClick={() => setCount(c => c - 1)}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Decrease count"
      >
        -
      </button>
      <span className="text-lg font-mono min-w-[3rem] text-center">{count}</span>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Increase count"
      >
        +
      </button>
    </div>
  );
};

// Custom components for MDX
export const components: MDXComponents = {
  // Override the default <h1> element
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'mt-10 scroll-m-20 text-4xl font-bold tracking-tight text-gray-900 dark:text-white',
        className
      )}
      {...props}
    />
  ),
  // Override the default <h2> element
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'mt-12 scroll-m-20 border-b border-gray-200 pb-2 text-3xl font-semibold tracking-tight text-gray-900 first:mt-0 dark:border-gray-700 dark:text-white',
        className
      )}
      {...props}
    />
  ),
  // Override the default <h3> element
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white',
        className
      )}
      {...props}
    />
  ),
  // Override the default <h4> element
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        'mt-6 scroll-m-20 text-xl font-semibold tracking-tight text-gray-900 dark:text-white',
        className
      )}
      {...props}
    />
  ),
  // Override the default <p> element
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 text-gray-700 dark:text-gray-300 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  ),
  // ✅ FIXED: Override the default <a> element
  a: ({ className, href = '', children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors',
            className
          )}
          {...props}
        >
          {children}
        </a>
      );
    }
    
    // For internal links, use Next.js Link (which doesn't accept HTML anchor attributes)
    return (
      <Link
        href={href}
        className={cn(
          'font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors',
          className
        )}
      >
        {children}
      </Link>
    );
  },
  // Override the default <ul> element
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props} />
  ),
  // Override the default <ol> element
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)} {...props} />
  ),
  // Override the default <li> element
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn('mt-2 text-gray-700 dark:text-gray-300', className)} {...props} />
  ),
  // Override the default <blockquote> element
  blockquote: ({
    className,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-blue-300 bg-gray-50 pl-6 py-4 italic text-gray-700 dark:border-blue-600 dark:bg-gray-800 dark:text-gray-300',
        className
      )}
      {...props}
    />
  ),
  // Override the default <img> element
  img: ({
    className,
    alt = '',
    width = 1200,
    height = 630,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // Skip if it's not a valid image source
    if (typeof props.src !== 'string') {
      return <img className={className} alt={alt} {...props} />;
    }

    // Handle external images with regular img tag
    if (props.src.startsWith('http')) {
      return (
        <figure className="my-8">
          <img
            src={props.src}
            alt={alt}
            className={cn(
              'w-full rounded-lg border border-gray-200 object-cover dark:border-gray-700',
              className
            )}
            {...props}
          />
          {alt && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }

    // Use Next.js Image component for local images
    return (
      <figure className="my-8">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={props.src}
            alt={alt}
            width={typeof width === 'number' ? width : 1200}
            height={typeof height === 'number' ? height : 630}
            className={cn(
              'rounded-lg border border-gray-200 object-cover dark:border-gray-700',
              className
            )}
          />
        </div>
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },
  // Override the default <code> element
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100',
        className
      )}
      {...props}
    />
  ),
  // Override the default <pre> element
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 p-4 text-gray-100 dark:border-gray-700',
        className
      )}
      {...props}
    />
  ),
  // Override the default <hr> element
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn('my-8 border-gray-200 dark:border-gray-700', className)}
      {...props}
    />
  ),
  // Override the default <table> element
  table: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full border-collapse border border-gray-200 dark:border-gray-700', className)} {...props} />
    </div>
  ),
  // Override the default <tr> element
  tr: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        'm-0 border-t border-gray-200 p-0 even:bg-gray-50 dark:border-gray-700 dark:even:bg-gray-800/50',
        className
      )}
      {...props}
    />
  ),
  // Override the default <th> element
  th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border border-gray-200 px-4 py-2 text-left font-bold text-gray-900 dark:border-gray-700 dark:text-white',
        className
      )}
      {...props}
    />
  ),
  // Override the default <td> element
  td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border border-gray-200 px-4 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-300',
        className
      )}
      {...props}
    />
  ),
  
  // ===== CUSTOM INTERACTIVE COMPONENTS =====
  
  // Interactive Counter component
  Counter,
  
  // Custom Callout component
  Callout: ({
    children,
    type = 'info',
    className,
    ...props
  }: {
    children: ReactNode;
    type?: 'info' | 'warning' | 'error' | 'success';
    className?: string;
  }) => {
    const typeStyles = {
      info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
      warning: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
      error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
      success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
    };

    const icons = {
      info: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };

    return (
      <div
        className={cn(
          'my-6 flex items-start gap-4 rounded-lg border p-4',
          typeStyles[type],
          className
        )}
        {...props}
      >
        <div className="mt-0.5 flex-shrink-0">
          {icons[type]}
        </div>
        <div className="[&>p]:m-0 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      </div>
    );
  },
  
  // Custom Card component
  Card: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),
};

// useMDXComponents function for additional customization
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
