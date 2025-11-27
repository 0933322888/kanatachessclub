'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import NotificationBell from './NotificationBell';

export default function Navbar({ session }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-whisky-800 shadow-lg border-b-2 border-whisky-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2 px-2 py-2 text-xl font-bold text-amber hover:text-amber-light transition-colors">
              <Image 
                src="/logo.svg" 
                alt="Kanata Chess Club Logo" 
                width={32} 
                height={32}
                className="rounded"
              />
              <span className="hidden sm:inline">Kanata Chess Club</span>
              <span className="sm:hidden">KCC</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                Home
              </Link>
              <Link href="/blog" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                Blog
              </Link>
              <Link href="/chess-for-kids" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                Chess for Kids
              </Link>
              <Link href="/learning" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                Learning
              </Link>
              {session && (
                <>
                  <Link href="/next-gathering" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                    Next Gathering
                  </Link>
                  <Link href="/tournaments" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                    Tournaments
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link href="/admin" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="hidden sm:flex items-center space-x-3">
                <NotificationBell />
                {session.user.avatar ? (
                  <img
                    src={session.user.avatar}
                    alt={session.user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-whisky-600 flex items-center justify-center border-2 border-amber shadow-md">
                    <span className="text-sm font-semibold text-amber">
                      {session.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <Link
                  href="/profile"
                  className="text-sm text-whisky-100 font-medium hover:text-amber transition-colors cursor-pointer"
                >
                  {session.user.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-white bg-burgundy rounded-md hover:bg-burgundy-dark shadow-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-amber rounded-md hover:bg-amber-dark shadow-md transition-colors">
                  Register
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-whisky-100 hover:text-amber hover:bg-whisky-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber transition-colors"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-whisky-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/chess-for-kids"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
            >
              Chess for Kids
            </Link>
            <Link
              href="/learning"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
            >
              Learning
            </Link>
            {session ? (
              <>
                <Link
                  href="/next-gathering"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                >
                  Next Gathering
                </Link>
                <Link
                  href="/tournaments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                >
                  Tournaments
                </Link>
                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                >
                  Notifications
                </Link>
                <div className="flex items-center px-3 py-2">
                  {session.user.avatar ? (
                    <img
                      src={session.user.avatar}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-amber mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-whisky-600 flex items-center justify-center border-2 border-amber mr-3">
                      <span className="text-xs font-semibold text-amber">
                        {session.user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-whisky-100 font-medium">{session.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-white bg-burgundy rounded-md hover:bg-burgundy-dark transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-whisky-100 hover:text-amber hover:bg-whisky-700 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white bg-amber rounded-md hover:bg-amber-dark transition-colors text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

