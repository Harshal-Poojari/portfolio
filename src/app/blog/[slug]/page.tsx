// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';
import BlogPostPage from '@/pages/BlogPostPage';


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
    
    return {
      title: `${post.seoTitle || post.title} - Prompto Blog`,
      description: post.seoDescription || post.excerpt || post.description || '',
      keywords: post.tags?.join(', '),
      authors: [{ name: typeof post.author === 'string' ? post.author : post.author?.name || 'Harshal Poojari' }],
      
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || post.description || '',
        type: 'article',
        url: `https://letsmakeai.com/blog/${params.slug}`,
        siteName: 'Prompto Blog',
        images: post.coverImage ? [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt || post.publishedAt,
        authors: [typeof post.author === 'string' ? post.author : post.author?.name || 'Harshal Poojari'],
        section: 'Technology',
        tags: post.tags,
      },
      
      twitter: {
        card: 'summary_large_image',
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || post.description || '',
        images: post.coverImage ? [post.coverImage] : [],
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
    
    return (
      <BlogPostPage 
        slug={params.slug}
        post={post} 
        relatedPosts={relatedPosts}
      />
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}
