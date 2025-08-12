import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import Head from 'next/head';
import DynamicNavigation from '@/components/Header';
import { NAVIGATION_ITEMS, NavigationItem } from '@/config/navigation';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Person schema for the entire site
const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Harshal Poojari",
  "jobTitle": "Web & Game Developer",
  "description": "Passionate web and game developer specializing in creating immersive digital experiences",
  "url": "https://letsmakeai.com",
  "sameAs": [
    "https://www.linkedin.com/in/harshal-poojari/",
    "https://github.com/Harshal-Poojari"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "LetsMakeAI"
  },
  "knowsAbout": ["Web Development", "Game Development", "Unity", "AI", "JavaScript", "React"]
};

export const metadata = {
  title: {
    default: 'Harshal Poojari | Web & Game Developer | AI & Unity Expert',
    template: '%s | Harshal Poojari'
  },
  description: 'Professional portfolio of Harshal Poojari - Web Developer, Game Developer, and AI Specialist.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/logo_portfolio.jpg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Harshal Poojari | Web & Game Developer | AI & Unity Expert',
    description: 'Professional portfolio showcasing web and game development projects, AI implementations, and technical blog.',
    url: 'https://letsmakeai.com',
    siteName: 'Harshal Poojari Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harshal Poojari | Web & Game Developer',
    description: 'Professional portfolio showcasing web and game development projects, AI implementations, and technical blog.',
    creator: '@harshalpoojari',
  },
};

// Component to check if the current page is the blog list page
function isBlogListPage(children) {
  if (typeof window === 'undefined') {
    // Server-side rendering - check the URL path
    const path = children?.props?.childProp?.segment;
    return path === 'blog';
  }
  // Client-side - check the current URL path
  return window.location.pathname === '/blog';
}

export default function RootLayout({ children }) {
  const [activeSection, setActiveSection] = useState('home');
  const hideNavbar = isBlogListPage(children);

  const onNavigate = (item) => {
    setActiveSection(item.id);
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/logo_portfolio.jpg" />
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioSchema, null, 2)
          }}
        />
      </head>
      <body className={`${inter.className} ${hideNavbar ? "min-h-screen" : "min-h-screen pb-24"}`}>
        <div className={hideNavbar ? "min-h-screen" : "min-h-screen pb-24"}>
          {!hideNavbar && (
            <DynamicNavigation
              items={NAVIGATION_ITEMS}
              activeSection={activeSection}
              onNavigate={onNavigate}
            />
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
