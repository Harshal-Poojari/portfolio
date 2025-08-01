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

const validRoutes = ['home', 'blog-list', 'blog-post', 'studio'];
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

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        // ✅ ADDED: Validate route before setting
        if (validRoutes.includes(event.state.page)) {
          setCurrentPage(event.state.page);
          setCurrentSlug(event.state.slug);
        } else {
          setCurrentPage('home');
          setCurrentSlug(undefined);
        }
      } else {
        setCurrentPage('home');
        setCurrentSlug(undefined);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: string, slug?: string) => {
    // ✅ ADDED: Validate route
    if (!validRoutes.includes(page)) {
      console.warn(`Invalid route: ${page}. Redirecting to home.`);
      page = 'home';
      slug = undefined;
    }

    // Add current state to history before navigating
    const currentState: RouterState = { 
      page: currentPage, 
      slug: currentSlug 
    };
    
    // Only add to history if it's different from the last entry
    setHistory(prev => {
      const lastEntry = prev[prev.length - 1];
      if (!lastEntry || lastEntry.page !== currentState.page || lastEntry.slug !== currentState.slug) {
        return [...prev, currentState];
      }
      return prev;
    });
    
    // ✅ IMPROVED: Better URL handling
    let url: string;
    if (page === 'home') {
      url = '/'; // Clean URL for home page
    } else if (slug) {
      url = `/#${page}/${slug}`;
    } else {
      url = `/#${page}`;
    }
    
    window.history.pushState({ page, slug }, '', url);
    
    setCurrentPage(page);
    setCurrentSlug(slug);
    
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
