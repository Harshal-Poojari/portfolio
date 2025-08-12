import React from 'react';
import type { Post } from '@/lib/api';

interface StructuredDataProps {
  post: Post;
}

function toISODate(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  try {
    return new Date(date).toISOString();
  } catch {
    return undefined;
  }
}

/**
 * This helper serializes author data for Schema.org. Handles string or object authors.
 */
function getAuthorSchema(author: any): any {
  if (!author) return { '@type': 'Person', name: 'Harshal Poojari' };
  if (typeof author === 'string') return { '@type': 'Person', name: author };
  // Optionally support multiple profiles / accounts
  const sameAs: string[] = [];
  if (author.twitter) sameAs.push(`https://twitter.com/${author.twitter}`);
  if (author.github) sameAs.push(`https://github.com/${author.github}`);
  if (author.website) sameAs.push(author.website);
  return {
    '@type': 'Person',
    name: author.name || 'Harshal Poojari',
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({ post }) => {
  if (!post || !post.title || !post.slug) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || (post as any).description || '',
    "author": {
      "@type": "Person",
      "name": typeof post.author === 'string' ? post.author : post.author?.name || 'Harshal Poojari',
      "url": "https://letsmakeai.com/about"
    },
    "datePublished": toISODate(post.publishedAt),
    "dateModified": toISODate(post.updatedAt) || toISODate(post.publishedAt),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://letsmakeai.com/blog/${post.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "LetsMakeAI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://letsmakeai.com/logo.png"
      }
    },
    "image": post.coverImage || "https://letsmakeai.com/default-blog-image.jpg",
    "url": `https://letsmakeai.com/blog/${post.slug}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData, null, 2) }}
    />
  );
};

export default StructuredData;
