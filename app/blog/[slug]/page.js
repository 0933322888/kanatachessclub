import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '../../../lib/blog-posts';

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    title: `${post.title} | Kanata Chess Club Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Kanata Chess Club Blog`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: `${siteUrl}/blog/${post.slug}`,
      images: [
        {
          url: `${siteUrl}${post.image}`,
          width: 128,
          height: 128,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Convert markdown-like content to HTML paragraphs
  const formatContent = (content) => {
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-whisky-900 mt-8 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      // Check if it's a bold title with description
      if (paragraph.includes('**') && paragraph.includes(':')) {
        const parts = paragraph.split(':');
        const title = parts[0].replace(/\*\*/g, '').trim();
        const description = parts.slice(1).join(':').trim();
        return (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold text-whisky-900 mb-2">{title}</h3>
            <p className="text-whisky-800">{description}</p>
          </div>
        );
      }
      // Check if it's a bullet list
      if (paragraph.includes('- **')) {
        const items = paragraph.split('- ').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-whisky-800 ml-4">
            {items.map((item, i) => {
              const cleanItem = item.trim().replace(/\*\*/g, '');
              return <li key={i}>{cleanItem}</li>;
            })}
          </ul>
        );
      }
      // Check if it's a numbered list
      if (paragraph.match(/^\d+\./)) {
        const items = paragraph.split(/\d+\./).filter(item => item.trim());
        return (
          <ul key={index} className="list-decimal list-inside space-y-2 mb-4 text-whisky-800 ml-4">
            {items.map((item, i) => (
              <li key={i}>{item.trim().replace(/\*\*/g, '')}</li>
            ))}
          </ul>
        );
      }
      // Regular paragraph with bold text support
      const formattedParagraph = paragraph.split(/\*\*(.*?)\*\*/g).map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i} className="font-semibold text-whisky-900">{part}</strong>;
        }
        return part;
      });
      
      return (
        <p key={index} className="text-whisky-800 mb-4 leading-relaxed">
          {formattedParagraph}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center text-whisky-700 hover:text-amber transition-colors mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      <article className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 sm:p-8">
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-amber text-white text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-whisky-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-whisky-600 border-b-2 border-whisky-300 pb-4">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </header>

        <div className="prose prose-whisky max-w-none">
          <div className="text-lg text-whisky-800 leading-relaxed">
            {formatContent(post.content)}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t-2 border-whisky-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Link
              href="/blog"
              className="px-6 py-3 bg-whisky-800 text-white rounded-md hover:bg-whisky-900 shadow-md transition-colors font-medium"
            >
              View All Posts
            </Link>
            <div className="text-sm text-whisky-600">
              <p>Want to learn more? Join us at Kanata Chess Club!</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

