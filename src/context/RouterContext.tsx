import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterState {
  page: string;
  slug?: string | undefined;
}

interface RouterContextType {
  currentPage: string;
  currentSlug?: string | undefined;
  navigateTo: (page: string, slug?: string) => void;
  goBack: () => void;
}

const validRoutes = ['home', 'blog-list', 'blog-post', 'studio', 'games'];
const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ✅ FIXED: Use 'home' instead of 'portfolio' (matches your validRoutes)
  const [currentPage, setCurrentPage] = useState('home');
  const [currentSlug, setCurrentSlug] = useState<string | undefined>();
  const [history, setHistory] = useState<RouterState[]>([]);

  // ✅ FIXED: Initialize with home page
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ page: 'home' }]);
    }
  }, []);

  // Handle browser back/forward buttons and initial load
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Handle direct URL access
      if (window.location.pathname.startsWith('/blog/') && window.location.pathname !== '/blog') {
        const slug = window.location.pathname.split('/').pop();
        if (slug) {
          setCurrentPage('blog-post');
          setCurrentSlug(slug);
          return;
        }
      }
      
      if (event.state && event.state.page) {
        // Validate route before setting
        if (validRoutes.includes(event.state.page)) {
          setCurrentPage(event.state.page);
          setCurrentSlug(event.state.slug);
        } else {
          setCurrentPage('home');
          setCurrentSlug(undefined);
        }
      } else {
        // Check for direct URL access
        const path = window.location.pathname;
        if (path === '/' || path === '') {
          setCurrentPage('home');
          setCurrentSlug(undefined);
        } else if (path === '/blog' || path === '/blog/') {
          setCurrentPage('blog-list');
          setCurrentSlug(undefined);
        } else if (path.startsWith('/blog/')) {
          const slug = path.split('/').pop();
          if (slug) {
            setCurrentPage('blog-post');
            setCurrentSlug(slug);
          } else {
            setCurrentPage('home');
            setCurrentSlug(undefined);
          }
        } else {
          setCurrentPage('home');
          setCurrentSlug(undefined);
        }
      }
    };

    // Initial load handling
    handlePopState({} as PopStateEvent);
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: string, slug?: string) => {
    console.log(`navigateTo called with page: ${page}, slug: ${slug}`);
    
    // Validate route
    if (!validRoutes.includes(page)) {
      console.warn(`Invalid route: ${page}. Valid routes are:`, validRoutes);
      page = 'home';
      slug = undefined;
    }

    console.log(`Navigating to:`, { page, slug, currentPage, currentSlug });

    // Add current state to history before navigating
    const currentState: RouterState = { 
      page: currentPage, 
      slug: currentSlug 
    };
    
    // Only add to history if it's different from the last entry
    setHistory(prev => {
      const lastEntry = prev[prev.length - 1];
      const shouldAdd = !lastEntry || lastEntry.page !== currentState.page || lastEntry.slug !== currentState.slug;
      console.log(`Adding to history:`, { shouldAdd, currentState, lastEntry });
      
      if (shouldAdd) {
        return [...prev, currentState];
      }
      return prev;
    });
    
    // URL handling
    let url: string;
    if (page === 'home') {
      url = '/';
    } else if (page === 'blog-list') {
      // Direct URL for blog list
      url = '/blog';
    } else if (slug) {
      // For blog posts, use a clean URL structure without the hash
      if (page === 'blog-post') {
        url = `/blog/${slug}`;
      } else {
        url = `/#${page}${slug ? `/${slug}` : ''}`;
      }
    } else {
      url = `/#${page}`;
    }
    
    console.log(`Updating URL to:`, url);
    window.history.pushState({ page, slug }, '', url);
    
    console.log(`Updating state to:`, { page, slug });
    setCurrentPage(page);
    setCurrentSlug(slug);
    
    console.log(`Current route after navigation:`, { currentPage, currentSlug });
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    console.log('Going back. Current history:', history);
    
    if (history.length > 0) {
      // Get the previous state
      const previous = history[history.length - 1];
      console.log('Previous state:', previous);
      
      if (previous && validRoutes.includes(previous.page)) {
        // Update history by removing the last entry
        setHistory(prev => prev.slice(0, -1));
        
        // ✅ IMPROVED: Better URL handling for back navigation
        let url: string;
        if (previous.page === 'home') {
          url = '/';
        } else if (previous.slug) {
          url = `/#${previous.page}/${previous.slug}`;
        } else {
          url = `/#${previous.page}`;
        }
        
        window.history.pushState(
          { page: previous.page, slug: previous.slug }, 
          '', 
          url
        );
        
        setCurrentPage(previous.page);
        setCurrentSlug(previous.slug);
      } else {
        // Fallback if previous is invalid
        console.log('Previous state invalid, falling back to home');
        goToHome();
      }
    } else {
      // No history, go to home
      console.log('No history, going to home');
      goToHome();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ FIXED: Helper function to navigate to home (instead of portfolio)
  const goToHome = () => {
    window.history.pushState({ page: 'home' }, '', '/');
    setCurrentPage('home');
    setCurrentSlug(undefined);
    setHistory([{ page: 'home' }]); // Reset history
  };

  return (
    <RouterContext.Provider value={{ currentPage, currentSlug, navigateTo, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};
