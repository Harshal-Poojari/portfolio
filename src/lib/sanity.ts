// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configuration from environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zcpo32br';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Validate configuration - only check if projectId exists, not against specific values
const isConfigured = !!projectId;

// Log configuration status
console.log('Sanity Configuration:', {
  projectId: projectId ? '***' + projectId.slice(-4) : 'Not set',
  dataset,
  isConfigured,
  env: process.env.NODE_ENV || 'development',
});

// Create client with better error handling
export const client = (() => {
  if (!isConfigured) {
    console.warn('⚠️ Sanity client is not properly configured. Using mock data.');
    return {
      fetch: async () => {
        console.log('📡 Using mock fetch - no real data will be loaded');
        return [];
      },
      config: () => ({
        projectId,
        dataset,
        apiVersion,
        useCdn: true,
      }),
    } as any;
  }

  try {
    console.log('🔌 Creating Sanity client with config:', {
      projectId: projectId ? `${projectId.substring(0, 4)}...${projectId.substring(projectId.length - 4)}` : 'missing',
      dataset,
      apiVersion,
    });

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      token: import.meta.env.VITE_SANITY_TOKEN, // Optional: Only needed for write operations
    });
    
    // Test the connection with a simple query
    const testQuery = '*[_type == "blogPost"][0]{_id,title}';
    console.log('🔍 Testing Sanity connection with query:', testQuery);
    
    client.fetch(testQuery)
      .then((result) => {
        if (result) {
          console.log('✅ Successfully connected to Sanity. First post:', {
            id: result._id,
            title: result.title || 'No title',
          });
        } else {
          console.log('ℹ️ Connected to Sanity but no blog posts found.');
        }
      })
      .catch((error) => {
        console.error('❌ Failed to connect to Sanity:', {
          message: error.message,
          status: error.statusCode,
          response: error.responseBody || 'No response body',
        });
      });
    
    return client;
  } catch (error) {
    console.error('❌ Failed to create Sanity client:', error);
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
