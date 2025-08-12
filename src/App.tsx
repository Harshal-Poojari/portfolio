// src/App.tsx

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ThemeProvider } from './context/ThemeContext';

// Import your new, centralized navigation configuration
import { NAVIGATION_ITEMS, NavigationItem } from './config/navigation';

// Import Components
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import Page Sections
import Hero from './components/Hero';
import About from './components/About';
import GameProjects from './components/GameProjects';
import WebProjects from './components/WebProjects';
import Blog from './components/Blog';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const { currentPage, currentSlug, navigateTo } = useRouter();
  
  // Navigation handler is now simpler, as routing logic can be in the data
  const onNavigate = useCallback((item: NavigationItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else if (item.href.startsWith('#')) {
      const element = document.getElementById(item.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  // Initialize router with current URL on component mount
  useEffect(() => {
    const handleInitialNavigation = () => {
      const path = window.location.pathname;
      console.log('Initial path:', path);
      
      // Handle direct navigation to blog post
      if (path.startsWith('/blog/')) {
        const slug = path.split('/blog/')[1];
        console.log('Direct navigation to blog post:', slug);
        if (slug) {
          navigateTo('blog-post', slug);
          return;
        }
      }
      
      // Handle other routes
      switch(path) {
        case '/blog':
        case '/blog/':
          navigateTo('blog-list');
          break;
        case '/':
        case '':
          navigateTo('home');
          break;
        default:
          // If no route matches, stay on the current page
          console.log('No matching route for path:', path);
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      handleInitialNavigation();
    }, 700);

    return () => clearTimeout(timer);
  }, [navigateTo]);

  // Scrollspy now uses the imported NAVIGATION_ITEMS
  useEffect(() => {
    if (isLoading) return;
    
    const handleScroll = () => {
      const offset = window.scrollY + 150;
      let currentSectionId = 'home';
      
      const allNavLinks = NAVIGATION_ITEMS.flatMap(i => i.subItems ?? i);
      
      for (const item of allNavLinks) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= offset) {
          currentSectionId = item.id;
        }
      }
      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);
  
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // Page routing logic
  let content;
  
  console.log('Rendering with:', { currentPage, currentSlug });
  
  switch (currentPage) {
    case 'blog-list':
      content = <BlogListPage />;
      break;
    case 'blog-post':
      if (currentSlug) {
        console.log('Rendering BlogPostPage with slug:', currentSlug);
        content = <BlogPostPage slug={currentSlug} />;
      } else {
        console.log('No slug provided for blog-post, redirecting to blog-list');
        // If no slug is provided, redirect to blog list
        content = <BlogListPage />;
      }
      break;
    default:
      content = (
        <>
          <section id="home"><Hero /></section>
          <section id="about"><About /></section>
          <section id="games"><GameProjects /></section>
          <section id="web"><WebProjects /></section>
          <section id="blog"><Blog /></section>
          <section id="certifications"><Certifications /></section>
          <section id="contact"><Contact /></section>
        </>
      );
  }

  // Check if current route is a blog page (list or post)
  const isBlogPage = () => {
    const path = window.location.pathname;
    // Only hide header for /blog, /blog/, and /blog/*
    return path === '/blog' || path === '/blog/' || path.startsWith('/blog/');
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {!isBlogPage() && (
        <Header 
          navItems={NAVIGATION_ITEMS} 
          activeSection={activeSection} 
          onNavigate={onNavigate} 
        />
      )}
      <main>
        {content}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}