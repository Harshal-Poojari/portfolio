'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { cn } from '@/lib/utils'; // if you have this utility
import { components } from './Blog/MDXComponents';

interface MdxProps {
  code: string;
  className?: string;
}

function MDXErrorFallback({ error }: { error: Error }) {
  return (
    <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
      <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2">
        Error rendering content
      </h3>
      <p className="text-red-600 dark:text-red-500 text-sm">
        {error.message}
      </p>
    </div>
  );
}

const PROSE_CLASSES = `
  prose prose-slate max-w-none dark:prose-invert dark:text-slate-400
  prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
  prose-h1:mb-4 prose-h1:text-4xl
  prose-h2:mb-4 prose-h2:mt-12 prose-h2:text-3xl
  prose-h3:mt-8 prose-h3:text-2xl
  prose-h4:mt-6 prose-h4:text-xl
  prose-h5:mt-4 prose-h5:text-lg
  prose-p:my-4 prose-p:leading-relaxed
  prose-blockquote:border-l-4 prose-blockquote:border-slate-200 dark:prose-blockquote:border-slate-700 
  prose-blockquote:pl-4 prose-blockquote:italic 
  prose-blockquote:text-slate-600 dark:prose-blockquote:text-slate-400
  prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-li:pl-1 
  prose-li:marker:text-slate-400 dark:prose-li:marker:text-slate-600
  prose-code:rounded-md prose-code:bg-slate-100 dark:prose-code:bg-slate-800 
  prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm 
  prose-code:before:content-[''] prose-code:after:content-['']
  prose-pre:bg-slate-900 dark:prose-pre:bg-slate-800 prose-pre:rounded-lg 
  prose-pre:overflow-x-auto prose-pre:p-4 prose-pre:shadow-lg
  prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-700
  prose-a:text-blue-600 hover:prose-a:text-blue-800 
  dark:prose-a:text-blue-500 dark:hover:prose-a:text-blue-400 
  prose-a:no-underline hover:prose-a:underline
  prose-table:my-6 prose-th:border-b prose-th:border-slate-300 dark:prose-th:border-slate-600 
  prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-3 prose-th:text-left
  prose-td:border-b prose-td:border-slate-200 dark:prose-td:border-slate-700 prose-td:p-3
`;

export const Mdx = memo(function Mdx({ code, className }: MdxProps) {
  const Component = useMDXComponent(code);

  if (!code) {
    return (
      <div className="text-slate-500 dark:text-slate-400 italic">
        No content available
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={MDXErrorFallback}>
      <div className={cn(PROSE_CLASSES, className)}>
        <Component components={components} />
      </div>
    </ErrorBoundary>
  );
});
