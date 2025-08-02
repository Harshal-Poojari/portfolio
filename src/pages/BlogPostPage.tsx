'use client';

import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Home,
  Share2,
  Eye,
  Heart,
  Tag as TagIcon,
  BookOpen,
} from 'lucide-react';
import DOMPurify from 'dompurify';

import { ThemeContext } from '@/App';
import { getPostBySlug, blogCategories } from '@/data/sanityPosts';
import { useRouter } from '@/context/RouterContext';
import type { BlogPost } from '@/types/blog';
import ErrorBoundary from '@/components/ErrorBoundary';
import StructuredData from '@/components/StructuredData';

interface BlogPostPageProps {
  slug: string;
}

// Utility functions
function getCategoryById(id?: string) {
  return blogCategories.find(cat => cat.id === id);
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  });
}

function getAuthorName(author: any) {
  if (!author) return 'Unknown Author';
  return typeof author === 'string' ? author : author.name || 'Unknown Author';
}

// Content renderer with enhanced safety
function RenderContent({ content, isDarkMode }: { content: string; isDarkMode: boolean }) {
  if (!content) {
    return (
      <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No content available for this post.
      </p>
    );
  }

  return (
    <div
      className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''}`}
      dangerouslySetInnerHTML={{ 
        __html: DOMPurify.sanitize(content, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
          ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel']
        })
      }}
    />
  );
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { goBack, navigateTo } = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch blog post data
  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedPost = await getPostBySlug(slug);
        if (!isMounted) return;
        
        if (!loadedPost) {
          setPost(null);
        } else {
          setPost(loadedPost);
          setLikeCount(loadedPost.likes || 0);
          setIsLiked(localStorage.getItem(`liked-${loadedPost.id}`) === 'true');
        }
      } catch (err) {
        console.error('Error loading post:', err);
        if (isMounted) setError('Failed to load blog post. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Update document title
  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Prompto Blog`;
    }
    return () => {
      document.title = 'Harshal Poojari - Game Developer Portfolio';
    };
  }, [post]);

  // Like functionality
  const handleLike = useCallback(() => {
    if (!post) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
    try {
      localStorage.setItem(`liked-${post.id}`, newLikedState.toString());
    } catch (error) {
      console.warn('Failed to save like status:', error);
    }
  }, [isLiked, post]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (!post) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // You could replace alert with a toast notification
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  }, [post]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500 mx-auto mb-6"></div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading Post...
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Fetching content from Sanity CMS
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-100'
          }`}>
            <BookOpen className={`w-10 h-10 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Post
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={goBack}
              className={`px-6 py-3 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Post not found state
  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
          }`}>
            <BookOpen className={`w-10 h-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Post Not Found
          </h1>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <motion.button
            onClick={goBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const category = getCategoryById(post.category);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
        {/* SEO Head Section */}
        <Head>
          <title>{post.seoTitle || post.title} - Prompto Blog | letsmakeai.com</title>
          <meta name="description" content={post.seoDescription || post.excerpt || post.title} />
          <meta property="og:title" content={post.seoTitle || post.title} />
          <meta property="og:description" content={post.seoDescription || post.excerpt || post.title} />
          <meta property="og:type" content="article" />
          {post.coverImage && <meta property="og:image" content={post.coverImage} />}
          <meta property="og:url" content={`https://letsmakeai.com/blog/${post.slug}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={post.seoTitle || post.title} />
          <meta name="twitter:description" content={post.seoDescription || post.excerpt || post.title} />
          {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
          <link rel="canonical" href={`https://letsmakeai.com/blog/${post.slug}`} />
          <meta name="author" content={getAuthorName(post.author)} />
          {post.publishedAt && <meta property="article:published_time" content={post.publishedAt} />}
          {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
          <StructuredData post={post} />
        </Head>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation & Action Bar */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <motion.button
              onClick={goBack}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isDarkMode 
                  ? 'text-indigo-400 hover:bg-slate-800/50 hover:text-indigo-300'
                  : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={isLiked}
                aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{likeCount}</span>
              </motion.button>

              <motion.button
                onClick={handleShare}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-gray-400 hover:bg-slate-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Share this post"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => navigateTo('blog-list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-gray-400 hover:bg-slate-600 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View all posts"
              >
                <Home className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            {/* Cover Image */}
            {post.coverImage && (
              <motion.div
                className="aspect-video rounded-2xl overflow-hidden shadow-xl mb-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </motion.div>
            )}

            {/* Post Metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white">
                  {category.name}
                </span>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {typeof post.views === 'number' && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{likeCount} likes</span>
                </div>
              </div>
            </div>

            {/* Title & Excerpt */}
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className={`text-xl mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {post.excerpt}
              </p>
            )}

            {/* Author & Date Info */}
            <div className={`flex flex-wrap items-center gap-6 text-sm pb-6 border-b ${
              isDarkMode ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'
            }`}>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime || 5} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{getAuthorName(post.author)}</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode
                        ? 'bg-indigo-900/40 text-indigo-200 border border-indigo-800'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    } hover:scale-105 transition-transform cursor-default`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RenderContent content={post.content || ''} isDarkMode={isDarkMode} />
          </motion.article>

          {/* Call to Action Footer */}
          <motion.footer
            className={`text-center mt-16 pt-12 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigateTo('blog-list')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore More Articles</span>
            </motion.button>
            <p className={`mt-4 text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Discover more insights on AI, development, and technology
            </p>
          </motion.footer>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default BlogPostPage;
