// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Fallback configuration for development
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'zcpo32br';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Create client with error handling
export const client = (() => {
  try {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  } catch (error) {
    console.error('Failed to create Sanity client:', error);
    // Return a mock client for development
    return {
      fetch: async () => [],
      config: () => ({ projectId, dataset, apiVersion }),
    } as any;
  }
})();

// Safe image URL builder
export const urlFor = (source: any) => {
  try {
    const builder = imageUrlBuilder(client);
    return builder.image(source);
  } catch (error) {
    console.error('Error creating image URL:', error);
    return {
      url: () => '/placeholder-image.jpg'
    };
  }
};

// Check if Sanity is properly configured
export const isSanityConfigured = () => {
  return !!(import.meta.env.VITE_SANITY_PROJECT_ID && projectId !== 'zcpo32br');
};
