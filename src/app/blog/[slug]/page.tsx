// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';
import BlogPostPage from '@/pages/BlogPostPage';
import { transformPostToBlogPost, transformPostsToBlogPosts } from '@/utils/transformPost';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found - Prompto Blog',
        description: 'The requested blog post could not be found.'
      };
    }
    
    const blogPost = transformPostToBlogPost(post);
    
    return {
      title: `${blogPost.seoTitle || blogPost.title} - Prompto Blog`,
      description: blogPost.seoDescription || blogPost.excerpt || '',
      keywords: blogPost.tags?.join(', '),
      authors: [{ name: typeof blogPost.author === 'string' ? blogPost.author : blogPost.author?.name || 'Harshal Poojari' }],
      
      openGraph: {
        title: blogPost.seoTitle || blogPost.title,
        description: blogPost.seoDescription || blogPost.excerpt || '',
        type: 'article',
        url: `https://letsmakeai.com/blog/${params.slug}`,
        siteName: 'Prompto Blog',
        images: blogPost.coverImage ? [
          {
            url: blogPost.coverImage,
            width: 1200,
            height: 630,
            alt: blogPost.title,
          }
        ] : [],
        publishedTime: blogPost.publishedAt,
        modifiedTime: blogPost.updatedAt || blogPost.publishedAt,
        authors: [typeof blogPost.author === 'string' ? blogPost.author : blogPost.author?.name || 'Harshal Poojari'],
        section: 'Technology',
        tags: blogPost.tags,
      },
      
      twitter: {
        card: 'summary_large_image',
        title: blogPost.seoTitle || blogPost.title,
        description: blogPost.seoDescription || blogPost.excerpt || '',
        images: blogPost.coverImage ? [blogPost.coverImage] : [],
        creator: '@yourtwitterhandle',
        site: '@letsmakeai',
      },
      
      alternates: {
        canonical: `https://letsmakeai.com/blog/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post - Prompto Blog',
      description: 'Read our latest blog post on AI, development, and technology.'
    };
  }
}

export default async function BlogPostRoute({ params }: PageProps) {
  console.log('🔍 [slug]/page.tsx - Requested slug:', params.slug);
  
  try {
    const post = await getPostBySlug(params.slug);
    console.log('📄 [slug]/page.tsx - Fetched post:', post ? 'Post found' : 'Post not found', post);
    
    if (!post) {
      console.error('❌ [slug]/page.tsx - No post found for slug:', params.slug);
      notFound();
    }
    
    const relatedPosts = await getRelatedPosts(post._id, 3);
    
    // Transform the post and related posts to match the BlogPost type
    const blogPost = transformPostToBlogPost(post);
    const relatedBlogPosts = transformPostsToBlogPosts(relatedPosts);
    
    return (
      <BlogPostPage 
        slug={params.slug}
        post={blogPost} 
        relatedPosts={relatedBlogPosts}
      />
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}
