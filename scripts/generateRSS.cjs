const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');

// Load environment variables from .env file
try {
  // Try to load from Vite's env file
  dotenv.config({ path: path.join(__dirname, '../.env') });
  
  // Also try to load from Vite's production env file
  dotenv.config({ path: path.join(__dirname, '../.env.production') });
  
  // Try to load from Sanity's env file
  dotenv.config({ path: path.join(__dirname, '../.env.local') });
} catch (e) {
  console.warn('⚠️  Could not load .env files, using process.env');
}

// Configuration
const siteURL = 'https://letsmakeai.com';
const author = {
  name: 'Harshal Poojari',
  email: 'harshalpoojari01@gmail.com',
  link: 'https://letsmakeai.com/about'
};

// Get Sanity configuration from environment variables
const projectId = process.env.VITE_SANITY_PROJECT_ID || 
                 process.env.SANITY_STUDIO_PROJECT_ID ||
                 process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
                 
const dataset = process.env.VITE_SANITY_DATASET || 
               process.env.SANITY_STUDIO_DATASET || 
               process.env.NEXT_PUBLIC_SANITY_DATASET || 
               'production';
               
const apiVersion = '2024-01-01';

console.log('Environment Variables:', {
  VITE_SANITY_PROJECT_ID: !!process.env.VITE_SANITY_PROJECT_ID,
  SANITY_STUDIO_PROJECT_ID: !!process.env.SANITY_STUDIO_PROJECT_ID,
  NEXT_PUBLIC_SANITY_PROJECT_ID: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  VITE_SANITY_DATASET: !!process.env.VITE_SANITY_DATASET,
  SANITY_STUDIO_DATASET: !!process.env.SANITY_STUDIO_DATASET,
  NEXT_PUBLIC_SANITY_DATASET: !!process.env.NEXT_PUBLIC_SANITY_DATASET
});

if (!projectId) {
  console.warn('⚠️  No Sanity project ID found. RSS feed will be generated with empty data.');
  generateEmptyRSS();
  process.exit(0);
}

// Initialize Sanity client
function generateEmptyRSS() {
  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Prompto Blog - LetsMakeAI</title>
    <link>${siteURL}/blog</link>
    <description>AI, Game Development, and Technology Insights</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
    <language>en-us</language>
    <copyright>${new Date().getFullYear()} ${author.name}. All rights reserved.</copyright>
    <atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml" />
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>LetsMakeAI RSS Generator</generator>
    <webMaster>${author.email} (${author.name})</webMaster>
    <managingEditor>${author.email} (${author.name})</managingEditor>
  </channel>
</rss>`;

  const outputPath = path.join(__dirname, '../public/rss.xml');
  fs.writeFileSync(outputPath, rssContent, 'utf8');
  console.log('✅ Empty RSS feed generated at public/rss.xml');
}

// Initialize Sanity client
const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion
});

async function fetchAllPosts() {
  try {
    // Fetch all posts with a generous limit
    const query = `*[_type == 'post' && !(_id in path('drafts.**'))] | order(publishedAt desc) [0...100] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      'author': author->{name, image},
      'tags': tags[]->{title, slug},
      'categories': categories[]->{title, slug},
      mainImage,
      _updatedAt
    }`;
    
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function generateRSSFeed() {
  try {
    const posts = await fetchAllPosts();
    const siteURL = 'https://letsmakeai.com';
    const date = new Date().toISOString();
    const author = {
      name: 'Harshal Poojari',
      email: 'harshalpoojari01@gmail.com',
      link: 'https://letsmakeai.com/about'
    };

    const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Prompto Blog - LetsMakeAI</title>
    <link>${siteURL}/blog</link>
    <description>AI, Game Development, and Technology Insights</description>
    <lastBuildDate>${date}</lastBuildDate>
    <language>en-us</language>
    <copyright>${new Date().getFullYear()} ${author.name}. All rights reserved.</copyright>
    <atom:link href="${siteURL}/rss.xml" rel="self" type="application/rss+xml" />
    <sy:updatePeriod>daily</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <generator>LetsMakeAI RSS Generator</generator>
    <webMaster>${author.email} (${author.name})</webMaster>
    <managingEditor>${author.email} (${author.name})</managingEditor>
    
    ${posts.map(post => {
      if (!post.slug) return ''; // Skip posts without a slug
      
      const postURL = `${siteURL}/blog/${post.slug.current || post.slug}`;
      const postDate = new Date(post.publishedAt || post._createdAt || new Date()).toUTCString();
      const content = post.excerpt || '';
      
      // Create a summary by taking the first 200 characters of content
      const summary = content
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .substring(0, 200)
        .trim() + (content.length > 200 ? '...' : '');
      
      // Get the first image if available
      const imageUrl = post.mainImage ? 
        `${siteURL}${post.mainImage.asset?.url || ''}` : '';
      
      // Get categories and tags
      const categories = (post.categories || []).map(cat => 
        `<category>${cat.title || ''}</category>`
      ).join('\n');
      
      const tags = (post.tags || []).map(tag => 
        `<category domain="tag">${tag.title || ''}</category>`
      ).join('\n');
      
      return `
      <item>
        <title><![CDATA[${post.title || 'Untitled Post'}]]></title>
        <link>${postURL}</link>
        <guid isPermaLink="true">${postURL}</guid>
        <pubDate>${postDate}</pubDate>
        <author>${author.email} (${author.name})</author>
        ${categories}
        ${tags}
        <description><![CDATA[${summary}]]></description>
        <content:encoded><![CDATA[
          ${imageUrl ? `<img src="${imageUrl}" alt="${post.title || ''}" />` : ''}
          <p>${content}</p>
        ]]></content:encoded>
        ${imageUrl ? `<media:content url="${imageUrl}" medium="image" type="image/jpeg" />` : ''}
        <dc:creator><![CDATA[${author.name}]]></dc:creator>
        <title><![CDATA[${post.title}]]></title>
        <link>${postURL}</link>
        <guid isPermaLink="true">${postURL}</guid>
        <pubDate>${postDate}</pubDate>
        <author>${author.email} (${author.name})</author>
        <description><![CDATA[${summary}]]></description>
        <content:encoded><![CDATA[
          <!DOCTYPE html>
          <html>
            <head>
              <title>${post.title}</title>
              <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"/>
              <link href="${siteURL}/styles.css" rel="stylesheet" type="text/css">
            </head>
            <body>
              <article>
                <h1>${post.title}</h1>
                ${post.coverImage ? `<img src="${post.coverImage.startsWith('http') ? post.coverImage : siteURL + post.coverImage}" alt="${post.title}" />` : ''}
                ${content}
                <p><a href="${postURL}">Read more on our website</a></p>
              </article>
            </body>
          </html>
        ]]></content:encoded>
        ${post.coverImage ? `<media:content url="${post.coverImage.startsWith('http') ? post.coverImage : siteURL + post.coverImage}" medium="image" />` : ''}
        ${post.tags && post.tags.length > 0 ? post.tags.map(tag => `<category>${tag}</category>`).join('') : ''}
      </item>`;
    }).join('')}
  </channel>
</rss>`;

    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the RSS feed to public/rss.xml
    fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXML);
    console.log('✅ RSS feed generated at public/rss.xml');
  } catch (error) {
    console.error('❌ Error generating RSS feed:');
    console.error(error);
    process.exit(1);
  }
}

generateRSSFeed();
