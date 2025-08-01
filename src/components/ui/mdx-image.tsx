import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface MDXImageProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none';
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
} as const;

export function MDXImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
  imgClassName,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  showCaption = true,
  rounded = 'md',
  shadow = 'md',
  ...props
}: MDXImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Skip rendering on the server to avoid hydration issues
  if (!isMounted) {
    return (
      <div 
        className={cn(
          'relative mx-auto my-6 overflow-hidden bg-gray-200 dark:bg-gray-800',
          roundedClasses[rounded],
          shadowClasses[shadow],
          className
        )}
        style={{
          aspectRatio: `${width} / ${height}`,
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    );
  }
  
  return (
    <figure className={cn('not-prose my-6 flex flex-col', className)}>
      <div 
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          roundedClasses[rounded],
          shadowClasses[shadow],
          isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-800' : 'bg-transparent'
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn(
            'h-auto w-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            imgClassName
          )}
          onLoadingComplete={() => setIsLoading(false)}
          {...props}
        />
      </div>
      {showCaption && caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
