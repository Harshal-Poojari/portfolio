// src/types/blog.ts
export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    slug: string;
    coverImage?: string;
    tags: string[];
    category: string;
    featured: boolean;
    author: string;
    readingTime: number;
    url: string;
    views?: number;
    likes?: number;
    publishedAt: string;
    seoTitle?: string;
    seoDescription?: string;
  }
  
  export interface BlogCategory {
    id: string;
    name: string;
    color: string;
  }
  
  export interface SanityImageAsset {
    _ref: string;
    _type: 'reference';
  }
  
  export interface SanityImage {
    _type: 'image';
    asset: SanityImageAsset;
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
  }
  
  export interface SanityBlogPost {
    _id: string;
    _type: 'blogPost';
    title: string;
    slug: {
      current: string;
    };
    excerpt?: string;
    coverImage?: SanityImage;
    category: string;
    tags?: string[];
    featured?: boolean;
    publishedAt: string;
    content: any[]; // Sanity rich text content
  }
  