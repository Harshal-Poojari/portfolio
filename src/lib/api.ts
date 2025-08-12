import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableTextBlock } from '@portabletext/types';
import { toPlainText } from '@portabletext/react';

// Sanity client configuration with better environment handling
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: import.meta.env.VITE_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: import.meta.env.PROD || process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
  perspective: 'published',
  token: import.meta.env.SANITY_API_TOKEN || process.env.SANITY_API_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

// Enhanced Post interface with better typing
export interface Author {
  name: string;
  role?: string;
  bio?: string;
  image?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Post {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  date: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  openGraphImage?: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
  draft?: boolean;
  body: PortableTextBlock[];
  content?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  author?: Author;
  relatedPosts?: Post[];
}

// Enhanced image URL helper with better error handling
export function getImageUrl(source: any, options?: { width?: number; height?: number; quality?: number }): string {
  if (!source) return '';
  
  try {
    if (typeof source === 'string') {
      if (source.startsWith('http') || source.startsWith('//')) {
        return source;
      }
      return source;
    }
    
    if (source.asset?._ref || source._ref) {
      let imageBuilder = builder.image(source);
      
      if (options?.width) imageBuilder = imageBuilder.width(options.width);
      if (options?.height) imageBuilder = imageBuilder.height(options.height);
      if (options?.quality) imageBuilder = imageBuilder.quality(options.quality);
      
      return imageBuilder.url() || '';
    }
    
    return '';
  } catch (error) {
    console.warn('Error generating image URL:', error);
    return '';
  }
}

// Calculate reading time from portable text
function calculateReadingTime(body: PortableTextBlock[]): number {
  if (!body || !Array.isArray(body)) return 5;
  
  try {
    const plainText = toPlainText(body);
    const wordsPerMinute = 200;
    const words = plainText.split(/\s+/).filter(Boolean).length;
    return Math.ceil(words / wordsPerMinute) || 5;
  } catch (error) {
    console.warn('Error calculating reading time:', error);
    return 5;
  }
}

// Enhanced fetch all posts with better filtering and sorting
export async function getAllPosts(options: {
  limit?: number;
  offset?: number;
  tag?: string;
  category?: string;
  featured?: boolean;
  excludeId?: string;
  relatedTo?: string[];
  searchQuery?: string;
  sortBy?: 'publishedAt' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<Post[]> {
  const {
    limit,
    offset = 0,
    tag,
    category,
    featured,
    excludeId,
    relatedTo,
    searchQuery,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = options;

  try {
    console.log('🔍 Fetching posts with options:', options);

    let query = `*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt)`;

    // Add filters
    if (tag) query += ` && "${tag}" in tags`;
    if (category) query += ` && category->slug.current == "${category}"`;
    if (featured) query += ' && featured == true';
    if (excludeId) query += ` && _id != "${excludeId}"`;
    if (searchQuery) {
      query += ` && (
        title match $searchQuery + "*" ||
        excerpt match $searchQuery + "*" ||
        pt::text(body) match $searchQuery + "*"
      )`;
    }
    
    if (relatedTo && relatedTo.length > 0) {
      const tagConditions = relatedTo.map(t => `"${t}" in tags`).join(' || ');
      const categoryConditions = relatedTo.map(t => `category->slug.current == "${t}"`).join(' || ');
      query += ` && (${tagConditions} || ${categoryConditions})`;
    }

    // Add sorting and projection
    query += `] | order(${sortBy} ${sortOrder}) {
      _id,
      _createdAt,
      _updatedAt,
      "slug": slug.current,
      title,
      excerpt,
      description,
      seoTitle,
      seoDescription,
      "date": publishedAt,
      publishedAt,
      updatedAt,
      "coverImage": mainImage,
      "openGraphImage": openGraphImage,
      tags,
      "category": category->title,
      featured,
      body,
      "readingTime": 5,
      views,
      likes,
      "author": author->{
        name,
        role,
        bio,
        "image": image,
        socialLinks
      }
    }`;

    // Add pagination
    if (offset || limit) {
      const start = offset;
      const end = limit ? start + limit : '';
      query += `[${start}...${end}]`;
    }

    console.log('📝 Final query:', query);
    
    // Fixed fetch call with proper parameter handling
    const posts = await client.fetch<Post[]>(query, searchQuery ? { searchQuery } : {});
    
    console.log(`✅ Fetched ${posts.length} posts from Sanity`);

    // Process posts for consistent structure
    return posts.map(post => ({
      ...post,
      coverImage: getImageUrl(post.coverImage, { width: 1200, height: 630, quality: 80 }),
      openGraphImage: getImageUrl(post.openGraphImage, { width: 1200, height: 630, quality: 90 }),
      readingTime: calculateReadingTime(post.body),
      author: post.author ? {
        ...post.author,
        image: getImageUrl(post.author.image, { width: 200, height: 200, quality: 80 })
      } : {
        name: 'Harshal Poojari',
        role: 'Game Developer',
        image: '/images/default-author.jpg'
      }
    }));

  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced single post fetching with better error handling
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!slug || typeof slug !== 'string') {
    console.warn('⚠️ Invalid slug provided:', slug);
    return null;
  }

  try {
    console.log('🔍 [api.ts] getPostBySlug - Requesting post with slug:', slug);
    console.log('🔍 [api.ts] Sanity Config:', {
      projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.VITE_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      useCdn: import.meta.env.PROD || process.env.NODE_ENV === 'production'
    });

    const query = `
      *[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
        _id,
        _createdAt,
        _updatedAt,
        "slug": slug.current,
        title,
        excerpt,
        description,
        seoTitle,
        seoDescription,
        "date": publishedAt,
        publishedAt,
        updatedAt,
        "coverImage": mainImage,
        "openGraphImage": openGraphImage,
        tags,
        "category": category->title,
        featured,
        body,
        views,
        likes,
        "author": author->{
          name,
          role,
          bio,
          "image": image,
          socialLinks
        },
        "relatedPosts": *[
          _type == "post" && 
          _id != ^._id && 
          defined(publishedAt) &&
          (
            count(tags[@ in ^.tags]) > 0 ||
            category._ref == ^.category._ref
          )
        ][0...3] {
          _id,
          "slug": slug.current,
          title,
          excerpt,
          "coverImage": mainImage,
          publishedAt,
          "readingTime": 5
        }
      }
    `;

    console.log('🔍 [api.ts] Executing Sanity query with slug:', slug);
    const post = await client.fetch<Post | null>(query, { slug });

    if (!post) {
      console.log('❌ [api.ts] No post found with slug:', slug);
      console.log('🔍 [api.ts] Query used:', query);
      return null;
    }

    console.log('✅ Successfully fetched post:', post.title);

    // Process the post
    const processedPost = {
      ...post,
      coverImage: getImageUrl(post.coverImage, { width: 1200, height: 630, quality: 80 }),
      openGraphImage: getImageUrl(post.openGraphImage, { width: 1200, height: 630, quality: 90 }),
      readingTime: calculateReadingTime(post.body),
      author: post.author ? {
        ...post.author,
        image: getImageUrl(post.author.image, { width: 200, height: 200, quality: 80 })
      } : {
        name: 'Harshal Poojari',
        role: 'Game Developer',
        image: '/images/default-author.jpg'
      },
      relatedPosts: post.relatedPosts?.map(related => ({
        ...related,
        coverImage: getImageUrl(related.coverImage, { width: 400, height: 200, quality: 70 }),
        readingTime: 5
      }))
    };

    return processedPost;

  } catch (error) {
    console.error('❌ Error fetching post by slug:', error);
    throw new Error(`Failed to fetch post with slug "${slug}": ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced tags fetching with better performance
export async function getAllTags(): Promise<{ name: string; count: number; slug: string }[]> {
  try {
    const query = `
      array::unique(*[_type == "post" && defined(publishedAt)].tags[]) | order(@) {
        "name": @,
        "count": count(*[_type == "post" && defined(publishedAt) && @ in tags])
      }
    `;

    const tags = await client.fetch<{ name: string; count: number }[]>(query);

    return tags.map(tag => ({
      ...tag,
      slug: tag.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Enhanced categories fetching - FIXED TYPE MISMATCH
export async function getAllCategories(): Promise<{ name: string; count: number; slug: string }[]> {
  try {
    const query = `
      *[_type == "category"] {
        title,
        "slug": slug.current,
        "count": count(*[_type == "post" && defined(publishedAt) && references(^._id)])
      } | order(count desc, title asc)
    `;

    // Fixed: Type the fetch response correctly
    const categories = await client.fetch<{ title: string; slug: string; count: number }[]>(query);

    return categories.map(cat => ({
      name: cat.title, // Now TypeScript knows cat.title exists
      slug: cat.slug,
      count: cat.count
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Enhanced related posts with better algorithm
export async function getRelatedPosts(postId: string, limit = 3): Promise<Post[]> {
  try {
    const query = `
      *[_type == "post" && _id == $postId][0] {
        "related": *[
          _type == "post" && 
          _id != $postId && 
          defined(publishedAt) &&
          (
            count(tags[@ in ^.tags]) > 0 ||
            category._ref == ^.category._ref
          )
        ] | score(
          count(tags[@ in ^.tags]) * 2 +
          (category._ref == ^.category._ref ? 1 : 0)
        ) | order(_score desc, publishedAt desc) [0...$limit] {
          _id,
          "slug": slug.current,
          title,
          excerpt,
          "coverImage": mainImage,
          publishedAt,
          tags,
          "category": category->title,
          "readingTime": 5
        }
      }.related
    `;

    const related = await client.fetch<Post[]>(query, { postId, limit });

    return related?.map(post => ({
      ...post,
      coverImage: getImageUrl(post.coverImage, { width: 400, height: 200, quality: 70 })
    })) || [];

  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Get post statistics
export async function getPostStats(): Promise<{
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  averageReadingTime: number;
}> {
  try {
    const query = `
      *[_type == "post" && defined(publishedAt)] {
        views,
        likes,
        "readingTime": 5
      } | {
        "totalPosts": count(@),
        "totalViews": sum(views),
        "totalLikes": sum(likes),
        "averageReadingTime": avg(readingTime)
      }[0]
    `;

    const stats = await client.fetch(query);

    return {
      totalPosts: stats.totalPosts || 0,
      totalViews: stats.totalViews || 0,
      totalLikes: stats.totalLikes || 0,
      averageReadingTime: Math.round(stats.averageReadingTime || 5)
    };
  } catch (error) {
    console.error('Error fetching post stats:', error);
    return {
      totalPosts: 0,
      totalViews: 0,
      totalLikes: 0,
      averageReadingTime: 5
    };
  }
}

// Increment post views
export async function incrementPostViews(postId: string): Promise<void> {
  try {
    await client
      .patch(postId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();
  } catch (error) {
    console.error('Error incrementing post views:', error);
  }
}

// FIXED: Search posts with better relevance scoring - RENAMED PARAMETER
export async function searchPosts(searchTerm: string, limit = 10): Promise<Post[]> {
  if (!searchTerm.trim()) return [];

  try {
    const query = `
      *[
        _type == "post" && 
        defined(publishedAt) &&
        (
          title match $searchTerm + "*" ||
          excerpt match $searchTerm + "*" ||
          pt::text(body) match $searchTerm + "*"
        )
      ] | score(
        boost(title match $searchTerm + "*", 3) +
        boost(excerpt match $searchTerm + "*", 2) +
        boost(pt::text(body) match $searchTerm + "*", 1)
      ) | order(_score desc, publishedAt desc) [0...$limit] {
        _id,
        "slug": slug.current,
        title,
        excerpt,
        "coverImage": mainImage,
        publishedAt,
        tags,
        "category": category->title,
        "readingTime": 5
      }
    `;

    const posts = await client.fetch<Post[]>(query, { searchTerm, limit });

    return posts.map(post => ({
      ...post,
      coverImage: getImageUrl(post.coverImage, { width: 400, height: 200, quality: 70 })
    }));

  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

// Export client for direct usage if needed
export { client };
