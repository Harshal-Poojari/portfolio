// src/types/blog.ts
export interface Author {
  name: string;
  image?: string;
  bio?: string;
  twitter?: string;
}

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
  isNew?: boolean; // Added missing property
  author: Author | string; // Changed order for better type inference
  readingTime: number;
  url: string;
  views?: number;
  likes?: number;
  comments?: number; // Added missing property
  difficulty?: string; // Added missing property
  publishedAt: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  openGraphImage?: string;
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
  