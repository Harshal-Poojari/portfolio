import * as React from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: string;
  className?: string;
  children?: React.ReactNode;
}

export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ title, language = 'text', showLineNumbers = false, highlightLines, className, children, ...props }, ref) => {
    const code = String(children).replace(/\n$/, '');
    
    return (
      <div 
        ref={ref}
        className={cn(
          'group relative my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700',
          'bg-gray-50 dark:bg-gray-900',
          className
        )}
        {...props}
      >
        {/* Header with language and copy button */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 text-xs dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            {title && (
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {title}
              </span>
            )}
            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
              {language}
            </span>
          </div>
          <CopyButton 
            text={code} 
            className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100" 
          />
        </div>
        
        {/* Code content */}
        <pre
          className={cn(
            'overflow-x-auto p-4 font-mono text-sm leading-relaxed',
            'text-gray-800 dark:text-gray-200',
            showLineNumbers && 'line-numbers',
            highlightLines && 'has-highlighted-lines',
            `language-${language}`
          )}
          data-line-numbers={showLineNumbers}
          data-line={highlightLines}
          role="region"
          aria-label={`Code block${title ? ` for ${title}` : ''} in ${language}`}
          tabIndex={0}
        >
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

// Enhanced copy button with error handling & feedback
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(true);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center rounded px-2 py-1 text-xs font-medium',
        'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700',
        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        copied && 'text-green-600 dark:text-green-400',
        error && 'text-red-600 dark:text-red-400',
        className
      )}
      title={copied ? 'Copied!' : error ? 'Copy failed' : 'Copy to clipboard'}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <svg className="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      )}
      {copied ? 'Copied!' : error ? 'Failed' : 'Copy'}
    </button>
  );
}
