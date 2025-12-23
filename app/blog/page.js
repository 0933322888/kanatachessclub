import Link from 'next/link';
import { getAllBlogPosts } from '../../lib/blog-posts';

export const metadata = {
  title: 'Chess Blog',
  description: 'Read chess tips, strategies, and insights from Kanata Chess Club. Learn about tactics, openings, tournaments, and more.',
  openGraph: {
    title: 'Chess Blog | Kanata Chess Club',
    description: 'Read chess tips, strategies, and insights from Kanata Chess Club. Learn about tactics, openings, tournaments, and more.',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-whisky-900 mb-4">
          Chess Blog
        </h1>
        <p className="text-xl text-whisky-700 max-w-2xl mx-auto">
          Tips, strategies, and insights to help you improve your chess game
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-whisky-600 text-lg">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 hover:border-amber hover:shadow-xl transition-all overflow-hidden flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-amber text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-whisky-900 mb-3 hover:text-amber transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-whisky-700 text-sm mb-4 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-whisky-300">
                    <div className="flex items-center justify-between text-xs text-whisky-600">
                      <span>{post.author}</span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}






