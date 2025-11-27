import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import Navbar from '../components/Navbar';
import Providers from '../components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kanata Chess Club',
  description: 'Local chess club website for managing gatherings, tournaments, and finding opponents',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
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

