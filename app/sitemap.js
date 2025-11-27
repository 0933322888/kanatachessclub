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
  ];

  // Optionally add dynamic pages (public user profiles)
  // Uncomment and modify if you want to include public user profiles
  /*
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../models/User')).default;
    
    await connectDB();
    const publicUsers = await User.find({ 
      // Add any filters for public profiles if needed
    }).select('_id').limit(1000); // Limit to prevent sitemap from being too large
    
    const userPages = publicUsers.map(user => ({
      url: `${baseUrl}/users/${user._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
    
    return [...staticPages, ...userPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages if database query fails
    return staticPages;
  }
  */

  return staticPages;
}

