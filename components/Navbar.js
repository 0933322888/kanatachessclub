'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar({ session }) {
  return (
    <nav className="bg-whisky-800 shadow-lg border-b-2 border-whisky-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 py-2 text-xl font-bold text-amber hover:text-amber-light transition-colors">
              Kanata Chess Club
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                Home
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
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-whisky-100 hover:text-amber transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-sm font-medium text-white bg-amber rounded-md hover:bg-amber-dark shadow-md transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

