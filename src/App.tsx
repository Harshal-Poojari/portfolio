'use client'; // If using Next.js app directory and this is a Client Component

import React, { useEffect, useState, createContext } from 'react';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import { RouterProvider, useRouter } from './context/RouterContext';
import LoadingScreen from './components/LoadingScreen';
import Blog from './components/Blog';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import ScrollToTop from './components/ScrollToTop';
import Hero from './components/Hero';
import About from './components/About';
import GameProjects from './components/GameProjects';
import WebProjects from './components/WebProjects';
import Certifications from './components/Certifications';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';


// Define the shape of theme context for better typing
interface ThemeContextType {
  isDarkMode: boolean,
  toggleTheme: () => void,
}

// Create Theme Context with default
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
});


const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { currentPage, currentSlug, navigateTo, goBack } = useRouter();

  // On mount: load saved theme, set smooth scroll, and debug env variables
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Debug environment variables for sanity
    console.log('🔍 App.tsx - Checking Sanity Configuration:', {
      'VITE_SANITY_PROJECT_ID': import.meta.env.VITE_SANITY_PROJECT_ID || 'Not set',
      'VITE_SANITY_DATASET': import.meta.env.VITE_SANITY_DATASET || 'Not set',
      'Available Sanity Variables': Object.keys(import.meta.env).filter(k => k.includes('SANITY')),
    });

    if (import.meta.env.VITE_SANITY_PROJECT_ID) {
      console.log('✅ Sanity Project ID found - blog should load from Sanity CMS');
    } else {
      console.warn('⚠️ No Sanity Project ID found - blog will show fallback');
      console.log('💡 Add VITE_SANITY_PROJECT_ID to your .env.local');
    }
  }, []);

  // On theme change: persist and toggle html classes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Toggle theme function to pass into context
  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Called when loading finishes (passes to LoadingScreen)
  const handleLoadingComplete = () => setIsLoading(false);

  // Handle route: if on Studio, redirect
  if (currentPage === 'studio') {
    // Redirect to Sanity Studio standalone
    setTimeout(() => {
      window.location.href = 'http://localhost:3333/';
    }, 100);
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
            <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} text-lg font-medium mb-2`}>Opening Studio...</p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Redirecting to Content Studio</p>
            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-2`}>Target: http://localhost:3333/</p>
          </div>
        </div>
      </ThemeContext.Provider>
    );
  }

  // Show Blog List page
  if (currentPage === 'blog-list') {
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <BlogListPage />
      </ThemeContext.Provider>
    );
  }

  // Show individual Blog Post page
  if (currentPage === 'blog-post' && currentSlug) {
    return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <BlogPostPage slug={currentSlug} />
      </ThemeContext.Provider>
    );
  }

  // Default: show main site pages with sections
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {!isLoading && (
        <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'}`}>
          <Header />
          <main>
            <section id="home"><Hero /></section>
            <section id="about"><About /></section>
            <section id="games"><GameProjects /></section>
            <section id="web"><WebProjects /></section>
            <section id="blog">
              {/* Debug info exists but visually hidden */}
              {process.env.NODE_ENV === 'development' && (
                <div className="sr-only">
                  {(() => { console.log('🔍 Rendering Blog section'); return null; })()}
                </div>
              )}
              <Blog />
            </section>
            <section id="certifications"><Certifications /></section>
            <section id="portfolio"><Portfolio /></section>
            <section id="contact"><Contact /></section>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </ThemeContext.Provider>
  );
};


function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
