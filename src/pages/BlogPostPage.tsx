import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Home, Share2, Eye, Heart, Tag as TagIcon, BookOpen } from 'lucide-react';
import DOMPurify from 'dompurify';
import { ThemeContext } from '@/App';
import { getPostBySlug, blogCategories } from '../data/sanityPosts';
import { useRouter } from '../context/RouterContext';
import type { BlogPost } from '../types/blog';
import ErrorBoundary from '../components/ErrorBoundary';

declare global {
  interface Window {  
    __theme: string;
  }
}

interface BlogPostPageProps {
  slug: string;
}

// Extract content rendering to utility function for better performance
const createContentRenderer = (isDarkMode: boolean) => {
  return (content: string): JSX.Element[] => {
    if (!content) {
      return [
        <p key="no-content" className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          No content available for this post.
        </p>
      ];
    }

    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let listItems: JSX.Element[] = [];
    let codeBlockLanguage = '';

    const addPendingListItems = (index: number): void => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="mb-6 ml-6 list-disc space-y-2">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          if (codeBlockContent.length > 0) {
            elements.push(
              <div
                key={`code-${index}`}
                className={`my-6 rounded-lg p-4 overflow-x-auto ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
                }`}
              >
                {codeBlockLanguage && (
                  <div className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {codeBlockLanguage}
                  </div>
                )}
                <pre className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <code>{codeBlockContent.join('\n')}</code>
                </pre>
              </div>
            );
          }
          codeBlockContent = [];
          inCodeBlock = false;
          codeBlockLanguage = '';
        } else {
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        addPendingListItems(index);
        elements.push(
          <h1 key={`h1-${index}`} className={`text-4xl font-bold mb-6 mt-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {line.slice(2)}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        addPendingListItems(index);
        elements.push(
          <h2 key={`h2-${index}`} className={`text-3xl font-bold mb-4 mt-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {line.slice(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        addPendingListItems(index);
        elements.push(
          <h3 key={`h3-${index}`} className={`text-2xl font-bold mb-4 mt-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // Handle list items
      if (line.startsWith('- ')) {
        listItems.push(
          <li key={`li-${index}`} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {line.slice(2)}
          </li>
        );
        return;
      }

      // Add pending list items before paragraphs
      if (listItems.length > 0 && line.trim()) {
        addPendingListItems(index);
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote 
            key={`quote-${index}`}
            className={`border-l-4 pl-6 py-2 my-6 italic text-lg ${
              isDarkMode 
                ? 'border-indigo-400 text-gray-300 bg-slate-800/30' 
                : 'border-indigo-500 text-gray-600 bg-indigo-50/30'
            }`}
          >
            {line.slice(2)}
          </blockquote>
        );
        return;
      }

      // Handle regular paragraphs
      if (line.trim() && !line.startsWith('#')) {
        try {
          const formattedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, `<code class="${isDarkMode ? 'bg-gray-800 text-indigo-300' : 'bg-gray-200 text-indigo-600'} px-1 py-0.5 rounded text-sm font-mono">$1</code>`)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:text-indigo-600 underline">$1</a>');

          // Sanitize HTML content before rendering
          const sanitizedContent = DOMPurify.sanitize(formattedLine, {
            ALLOWED_TAGS: ['strong', 'em', 'code', 'a'],
            ALLOWED_ATTR: ['class', 'href', 'target', 'rel']
          });

          elements.push(
            <p 
              key={`p-${index}`} 
              className={`mb-6 text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          );
        } catch (error) {
          console.error('Error processing line:', line, error);
        }
      }  
    });

    // Add remaining list items
    if (listItems.length > 0) {
      elements.push(
        <ul key="list-final" className="mb-6 ml-6 list-disc space-y-2">
          {listItems}
        </ul>
      );
    }

    // FIXED: Always return elements array to satisfy TypeScript
    return elements.length > 0 ? elements : [
      <p key="fallback" className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Content is being processed...
      </p>
    ];
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { goBack, navigateTo } = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // SEO Meta Tags Update
  const updateMetaTags = useCallback((post: BlogPost): void => {
    document.title = `${post.title} - Harshal Poojari`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = post.excerpt;
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = post.excerpt;
      document.head.appendChild(newMetaDescription);
    }

    // Update Open Graph tags
    const updateOrCreateMetaTag = (property: string, content: string): void => {
      let metaTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (metaTag) {
        metaTag.content = content;
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    updateOrCreateMetaTag('og:title', post.title);
    updateOrCreateMetaTag('og:description', post.excerpt);
    updateOrCreateMetaTag('og:url', window.location.href);
    if (post.coverImage) {
      updateOrCreateMetaTag('og:image', post.coverImage);
    }
    updateOrCreateMetaTag('og:type', 'article');
    
    // Twitter Card tags
    updateOrCreateMetaTag('twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('twitter:title', post.title);
    updateOrCreateMetaTag('twitter:description', post.excerpt);
    if (post.coverImage) {
      updateOrCreateMetaTag('twitter:image', post.coverImage);
    }
  }, []);

  // Load post data
  useEffect(() => {
    let isMounted = true;

    const loadPost = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const foundPost = await getPostBySlug(slug);
        
        if (!isMounted) return;

        if (foundPost) {
          setPost(foundPost);
          updateMetaTags(foundPost);
          setLikeCount(foundPost.likes || 0);
          
          // Check if user has liked this post
          const hasLiked = localStorage.getItem(`liked-${foundPost.id}`) === 'true';
          setIsLiked(hasLiked);
        } else {
          setPost(null);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadPost();

    return () => {
      isMounted = false;
      document.title = 'Harshal Poojari - Game Developer & Web Engineer';
    };
  }, [slug, updateMetaTags]);

  // FIXED: Memoized content renderer with proper error handling
  const renderContent = useMemo(() => {
    return (content: string): JSX.Element[] => {
      try {
        return createContentRenderer(isDarkMode)(content);
      } catch (error) {
        console.error('Error rendering content:', error);
        return [
          <p key="render-error" className="text-red-500">
            Error rendering content. Please try refreshing the page.
          </p>
        ];
      }
    };
  }, [isDarkMode]);

  // Memoized rendered content
  const renderedContent = useMemo(() => {
    if (!post) return [];
    return renderContent(post.content || post.excerpt || 'No content available.');
  }, [post, renderContent]);

  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }, []);

  const handleLike = useCallback((): void => {
    if (!post) return;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    localStorage.setItem(`liked-${post.id}`, newLikedState.toString());
  }, [post, isLiked]);

  const sharePost = useCallback(async (): Promise<void> => {
    if (!post) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Share cancelled');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  }, [post]);

  const handleRetry = useCallback((): void => {
    window.location.reload();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading post...
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Fetching content from Sanity CMS
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-100'
          }`}>
            <BookOpen className={`w-12 h-12 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Error Loading Post
          </h1>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button 
              onClick={handleRetry}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            <motion.button 
              onClick={goBack}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
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
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <motion.div 
          className="text-center max-w-md mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
          }`}>
            <BookOpen className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Post Not Found
          </h1>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <motion.button 
            onClick={goBack}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const category = blogCategories.find(cat => cat.id === post.category);

  // Main render with ErrorBoundary wrapping the entire content
  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {/* Header Bar */}
        <motion.div 
          className={`sticky top-0 z-50 backdrop-blur-md border-b ${
            isDarkMode 
              ? 'bg-slate-900/80 border-slate-700' 
              : 'bg-white/80 border-gray-200'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.button 
                onClick={goBack}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'text-indigo-400 hover:bg-slate-800 hover:text-indigo-300'
                    : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Blog</span>
                <span className="sm:hidden">Back</span>
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isLiked
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                      : isDarkMode
                        ? 'text-gray-400 hover:bg-slate-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${isLiked ? 'Unlike' : 'Like'} this post`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likeCount}</span>
                </motion.button>

                <motion.button 
                  onClick={sharePost}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'text-gray-400 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Share this post"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>

                <motion.button 
                  onClick={() => navigateTo('blog-list')}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'text-gray-400 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Go to blog list"
                >
                  <Home className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div 
          className="container mx-auto px-6 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-12">
              {post.coverImage && (
                <motion.div 
                  className="aspect-video mb-8 rounded-xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  {category && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-500 text-white">
                      {category.name}
                    </span>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    {post.views && post.views > 0 && (
                      <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()} views
                      </div>
                    )}
                    <div className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                      {likeCount} likes
                    </div>
                  </div>
                </div>

                <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {post.title}
                </h1>
                
                <p className={`text-xl md:text-2xl mb-8 leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {post.excerpt}
                </p>

                {/* Meta Information */}
                <div className={`flex flex-wrap items-center gap-6 text-sm pt-6 border-t ${
                  isDarkMode 
                    ? 'text-gray-400 border-gray-700' 
                    : 'text-gray-500 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} min read</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {post.tags.map((tag: string) => (
                      <motion.span
                        key={tag}
                        className={`px-4 py-2 text-sm rounded-full font-medium ${
                          isDarkMode
                            ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-800'
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            </header>

            {/* Article Body */}
            <motion.article 
              className={`prose prose-lg max-w-none ${
                isDarkMode ? 'prose-invert' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="space-y-6">
                {renderedContent}
              </div>
            </motion.article>

            {/* Back to Blog CTA */}
            <motion.div 
              className="text-center mt-16 pt-12 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button 
                onClick={() => navigateTo('blog-list')}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-500/25'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5" />
                <span>View All Posts</span>
              </motion.button>
              <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore more articles and tutorials
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default BlogPostPage;
