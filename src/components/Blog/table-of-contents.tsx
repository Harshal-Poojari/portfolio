import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Simple utility function (avoiding external dependency)
const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  containerSelector?: string;
  offsetY?: number;
  headings?: Heading[];
  minLevel?: number;
  maxLevel?: number;
  showBackToTop?: boolean;
}

export function TableOfContents({
  className,
  containerSelector = 'article',
  offsetY = 100,
  headings: externalHeadings,
  minLevel = 2,
  maxLevel = 3,
  showBackToTop = true,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>(externalHeadings || []);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Extract headings from the DOM if not provided
  useEffect(() => {
    if (externalHeadings && externalHeadings.length > 0) return;

    const article = document.querySelector(containerSelector);
    if (!article) return;

    const headingElements = Array.from(
      article.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6')
    );

    const extractedHeadings = headingElements
      .filter((heading): heading is HTMLHeadingElement => {
        if (!heading || !heading.tagName) return false;
        const level = parseInt(heading.tagName[1] || '2');
        return level >= minLevel && level <= maxLevel;
      })
      .map((heading) => {
        // Ensure we always have a valid ID (fix for string | undefined error)
        let headingId = heading.id;
        if (!headingId) {
          const textContent = heading.textContent || '';
          headingId = textContent
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;
          heading.id = headingId;
        }
        
        // Ensure we always have valid text (fix for string | undefined error)
        const text = heading.textContent?.trim() || 'Untitled Section';
        
        return {
          id: headingId, // Now guaranteed to be string, not string | undefined
          text: text,   // Now guaranteed to be string, not string | undefined
          level: parseInt(heading.tagName[1] || '2'),
        };
      })
      .filter((heading): heading is Heading => {
        // Double check that we have valid strings (not undefined)
        return Boolean(heading.text && heading.id && !isNaN(heading.level));
      });

    setHeadings(extractedHeadings);
  }, [containerSelector, externalHeadings, maxLevel, minLevel]);

  // Update active heading based on scroll position
  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offsetY;
      let currentActiveId: string | null = null;

      // Find the active heading by checking which one is currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        
        // heading.id is now guaranteed to be string, not undefined
        if (!heading || !heading.id) continue;
        
        const element = document.getElementById(heading.id);
        if (!element) continue;

        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        
        if (scrollPosition >= elementTop) {
          currentActiveId = heading.id;
          break;
        }
      }

      // If no heading is active and we're at the top, activate the first one
      if (!currentActiveId && window.scrollY < 200 && headings.length > 0) {
        const firstHeading = headings[0];
        // firstHeading.id is guaranteed to be string
        if (firstHeading?.id) {
          currentActiveId = firstHeading.id;
        }
      }

      setActiveId(currentActiveId);
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [headings, offsetY]);

  // Don't render if no headings
  if (!headings || headings.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    // id parameter is now guaranteed to be string, not string | undefined
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const offsetTop = elementTop - 80; // Account for sticky header
      
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth',
      });
      
      // Update URL without adding to history - id is guaranteed to be string
      const newUrl = `${window.location.pathname}#${id}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // window.location.pathname is guaranteed to be string
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Calculate reading progress safely
  const getReadingProgress = (): number => {
    if (typeof window === 'undefined') return 0;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return 0;
    
    return Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
  };

  return (
    <div className={cn('sticky top-6 max-h-[calc(100vh-3rem)] overflow-auto', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Table of Contents
        </h2>
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            aria-label="Back to top"
          >
            Back to top
          </button>
        )}
      </div>
      
      <nav aria-label="Table of contents">
        <ul className="space-y-1.5 border-l border-gray-200 dark:border-gray-700">
          {headings.map(({ id, text, level }) => {
            // All properties are now guaranteed to be strings, not string | undefined
            const paddingLeft = `${(level - minLevel) * 16 + 16}px`;
            const isActive = activeId === id;
            
            return (
              <li key={id} style={{ paddingLeft }} className="relative">
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
                <button
                  onClick={() => scrollToHeading(id)} // id is guaranteed to be string
                  className={cn(
                    'group flex items-center py-1.5 px-2 text-sm transition-all duration-200 w-full text-left rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400',
                    isActive 
                      ? 'font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                      : 'font-normal'
                  )}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <ChevronRight
                    className={cn(
                      'mr-2 h-3.5 w-3.5 flex-shrink-0 transform transition-all duration-200',
                      isActive ? 'translate-x-0 opacity-100 text-blue-600 dark:text-blue-400' : '-translate-x-1 opacity-0',
                      'group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate leading-relaxed">{text}</span> {/* text is guaranteed to be string */}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Reading Progress</span>
          <span>{Math.round(getReadingProgress())}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 dark:bg-blue-400"
            style={{ width: `${getReadingProgress()}%` }}
          />
        </div>
      </div>
    </div>
  );
}
