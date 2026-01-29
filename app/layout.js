import './globals.css';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';
import { getSiteConfig } from '../lib/site-config';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant'
});

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
    default: getSiteConfig().name,
    template: `%s | ${getSiteConfig().name}`,
  },
  description: getSiteConfig().description,
  keywords: ['chess', 'chess club', 'Kanata', 'Ottawa', 'tournament', 'chess tournament', 'chess community', 'local chess', 'chess lessons', 'free chess', 'chess strategy', 'chess learning', 'kids chess'],
  authors: [{ name: getSiteConfig().name }],
  creator: getSiteConfig().name,
  publisher: getSiteConfig().name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: siteUrl,
    siteName: getSiteConfig().name,
    title: getSiteConfig().name,
    description: getSiteConfig().description,
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
    title: getSiteConfig().name,
    description: getSiteConfig().description,
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
    google: 'frCkbdgPCXFILp9jmAsTAzxRbPtduhq_kgy-JKrBf2A',
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const { name, description, address, gatheringDay, gatheringTime } = getSiteConfig();
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][gatheringDay];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: name,
    description: description,
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    image: `${siteUrl}/logo.svg`,
    sameAs: [],
    address: {
      '@type': 'PostalAddress',
      streetAddress: address, // Helper: This might need splitting if strict schema required, but string is often okay or we parse it
      addressLocality: 'Ottawa', // Generalizing for now
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '45.3129',
      longitude: '-75.9248',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${dayName}`,
        opens: gatheringTime.split(' - ')[0], // Rough parsing
        closes: gatheringTime.split(' - ')[1],
      },
    ],
    priceRange: 'Free',
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
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <Providers session={session}>
          <Navbar session={session} />
          <main className="min-h-screen bg-whisky-50">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

