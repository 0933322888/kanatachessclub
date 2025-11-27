'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error?.message || 'An unexpected error occurred'}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

