import Link, { LinkProps as NextLinkProps } from 'next/link';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface CustomLinkProps extends NextLinkProps {
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

CustomLink.displayName = 'CustomLink';
