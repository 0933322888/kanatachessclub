import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Navbar from '../components/Navbar';
import Providers from '../components/Providers';

const inter = Inter({ subsets: ['latin'] });

// Get site URL with proper validation and fallback
const getSiteUrl = () => {
  const envUrl = process.env.NEXTAUTH_URL;
  
  // Validate URL format
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    try {
      // Test if it's a valid URL
      new URL(envUrl);
      return envUrl;
    } catch {
      // Invalid URL format, use fallback
    }
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kanata Chess Club',
    template: '%s | Kanata Chess Club',
  },
  description: 'A local community of chess enthusiasts in Kanata. Join us for biweekly gatherings, tournaments, and friendly matches. Free to play, all ages and abilities welcome.',
  keywords: ['chess', 'chess club', 'Kanata', 'Ottawa', 'tournament', 'chess tournament', 'chess community', 'local chess'],
  authors: [{ name: 'Kanata Chess Club' }],
  creator: 'Kanata Chess Club',
  publisher: 'Kanata Chess Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: 'Kanata Chess Club',
    title: 'Kanata Chess Club',
    description: 'A local community of chess enthusiasts in Kanata. Join us for biweekly gatherings, tournaments, and friendly matches.',
    images: [
      {
        url: `${siteUrl}/logo.svg`,
        width: 128,
        height: 128,
        alt: 'Kanata Chess Club Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Kanata Chess Club',
    description: 'A local community of chess enthusiasts in Kanata. Join us for biweekly gatherings, tournaments, and friendly matches.',
    images: [`${siteUrl}/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification if needed
    // google: 'your-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kanata Chess Club',
    description: 'A local community of chess enthusiasts in Kanata, Ontario. Join us for biweekly gatherings, tournaments, and friendly matches.',
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kanata',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar session={session} />
          <main className="min-h-screen bg-whisky-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

