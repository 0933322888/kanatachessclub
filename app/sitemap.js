// Get site URL helper (reusing logic from layout)
function getSiteUrl() {
  const envUrl = process.env.NEXTAUTH_URL;
  
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    try {
      new URL(envUrl);
      return envUrl;
    } catch {
      // Invalid URL format, use fallback
    }
  }
  
  // Default to production URL or localhost for development
  return process.env.NODE_ENV === 'production' 
    ? 'https://kanatachessclub.vercel.app'
    : 'http://localhost:3000';
}

export default async function sitemap() {
  const baseUrl = getSiteUrl();
  
  // Static pages that are publicly accessible
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learning`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chess-for-kids`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Add blog post pages dynamically
  try {
    const { getAllBlogPosts } = await import('../lib/blog-posts');
    const blogPosts = getAllBlogPosts();
    
    const blogPostPages = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
    
    return [...staticPages, ...blogPostPages];
  } catch (error) {
    console.error('Error generating blog posts for sitemap:', error);
    // Return static pages if blog posts can't be loaded
    return staticPages;
  }
}

