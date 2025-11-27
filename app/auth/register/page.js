'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    chessComUsername: '',
    preferredStrength: 'Beginner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          chessComUsername: formData.chessComUsername || null,
          preferredStrength: formData.preferredStrength,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/auth/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-whisky-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-whisky-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-whisky-700">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-amber hover:text-amber-dark">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-burgundy-light border-2 border-burgundy text-white px-4 py-3 rounded-lg shadow-md">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-whisky-800">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-whisky-800">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-whisky-800">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-whisky-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-whisky-800">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="chessComUsername" className="block text-sm font-medium text-whisky-800">
                Chess.com Username (optional)
              </label>
              <input
                id="chessComUsername"
                name="chessComUsername"
                type="text"
                value={formData.chessComUsername}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border-2 border-whisky-300 placeholder-whisky-400 text-whisky-900 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm"
                placeholder="username"
              />
            </div>
            <div>
              <label htmlFor="preferredStrength" className="block text-sm font-medium text-whisky-800">
                Preferred Playing Strength
              </label>
              <select
                id="preferredStrength"
                name="preferredStrength"
                value={formData.preferredStrength}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber sm:text-sm text-whisky-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber hover:bg-amber-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber disabled:opacity-50 shadow-md transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-whisky-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-whisky-50 text-whisky-700">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border-2 border-whisky-300 rounded-md bg-white text-whisky-900 hover:bg-whisky-50 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium">Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

