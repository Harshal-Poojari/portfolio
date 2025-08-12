import React from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  name: string;
  href: string;
}

const Breadcrumbs: React.FC<{ className?: string }> = ({ className = '' }) => {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return [];
    
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Customize names based on routes
      let name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      // Special case for common routes
      const routeNames: Record<string, string> = {
        'blog': 'Blog',
        'portfolio': 'Portfolio',
        'about': 'About',
        'contact': 'Contact',
        'projects': 'Projects',
        'tags': 'Tags',
        'category': 'Category'
      };
      
      if (routeNames[segment]) {
        name = routeNames[segment];
      }
      
      // Don't add current page if it's a dynamic route (like [slug])
      if (segment.startsWith('[') && segment.endsWith(']')) {
        return;
      }
      
      breadcrumbs.push({
        name,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs if we're on the home page or only have one segment
  if (breadcrumbs.length <= 1) {
    return null;
  }

  // Generate schema.org BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://letsmakeai.com${crumb.href}`
    }))
  };

  return (
    <nav className={`breadcrumbs mb-8 ${className}`} aria-label="Breadcrumb">
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema, null, 2) }}
      />
      
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
