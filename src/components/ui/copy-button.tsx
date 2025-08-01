import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  successText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'solid';
}

export function CopyButton({
  text,
  successText = 'Copied!',
  className,
  size = 'md',
  variant = 'ghost',
  onClick,
  disabled,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    try {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('Failed to copy text');
        }
      }
      
      setIsCopied(true);
      setIsError(false);
      
      // Reset state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        setIsError(false);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy text:', error);
      setIsError(true);
      setIsCopied(false);
      
      // Reset error state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsError(false);
      }, 2000);
    }
    
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  const sizeClasses = {
    sm: 'h-7 w-7 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2',
  };
  
  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const variantClasses = {
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
    solid: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
  };
  
  const getButtonState = () => {
    if (isError) return { text: 'Failed', color: 'text-red-500' };
    if (isCopied) return { text: successText, color: 'text-green-500' };
    return { text: 'Copy to clipboard', color: '' };
  };
  
  const buttonState = getButtonState();
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        isError && 'text-red-500 hover:text-red-600',
        isCopied && 'text-green-500 hover:text-green-600',
        className
      )}
      title={buttonState.text}
      aria-label={buttonState.text}
      {...props}
    >
      {isCopied ? (
        <Check className={cn(iconSizes[size], 'text-green-500')} />
      ) : isError ? (
        <svg 
          className={cn(iconSizes[size], 'text-red-500')} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      ) : (
        <Copy className={iconSizes[size]} />
      )}
      <span className="sr-only">{buttonState.text}</span>
    </button>
  );
}
