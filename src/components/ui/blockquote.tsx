import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface BlockquoteProps extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  cite?: string;
  author?: string;
  source?: string;
  align?: 'left' | 'center' | 'right';
  variant?: 'default' | 'highlighted' | 'bordered';
}

export function Blockquote({
  cite,
  author,
  source,
  align = 'left',
  variant = 'default',
  className,
  children,
  ...props
}: BlockquoteProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const variantClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    highlighted: 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200',
    bordered: 'border-l-4 border-primary-500 dark:border-primary-400',
  };

  return (
    <figure className={cn('my-6', alignmentClasses[align])}>
      <blockquote
        className={cn(
          'relative rounded-lg p-6 text-lg font-medium italic leading-relaxed',
          'md:text-xl',
          variantClasses[variant],
          className
        )}
        cite={cite}
        {...props}
      >
        <Quote
          className={cn(
            'absolute -top-2 left-4 h-8 w-8 -translate-y-1/2 transform opacity-10',
            'text-primary-500 dark:text-primary-400',
            align === 'right' && 'left-auto right-4',
            align === 'center' && 'left-1/2 -translate-x-1/2'
          )}
          aria-hidden="true"
        />
        <div className="relative z-10">
          {children}
          {(author || source) && (
            <footer className="mt-4 text-sm font-normal not-italic text-gray-500 dark:text-gray-400">
              {author && <cite className="font-medium text-gray-700 dark:text-gray-300">{author}</cite>}
              {author && source && ', '}
              {source && (
                <cite className="font-normal">
                  {cite ? (
                    <a
                      href={cite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {source}
                    </a>
                  ) : (
                    source
                  )}
                </cite>
              )}
            </footer>
          )}
        </div>
      </blockquote>
    </figure>
  );
}
