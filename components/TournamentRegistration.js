'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default function TournamentRegistration({ tournament, isRegistered, userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournamentId: tournament._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Registration failed');
        return;
      }

      // Refresh the page to show updated registration status
      router.refresh();
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/tournaments/unregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournamentId: tournament._id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Unregistration failed');
        return;
      }

      // Refresh the page to show updated registration status
      router.refresh();
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eventDate = new Date(tournament.eventDate);
  const isPast = eventDate < new Date();

  return (
    <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
      <h3 className="text-xl font-semibold text-whisky-900 mb-3">
        {tournament.name}
      </h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-3">
          <span className="text-xl">📅</span>
          <div>
            <p className="text-whisky-800 font-medium">
              {formatDate(eventDate)}
            </p>
            <p className="text-sm text-whisky-600">
              {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-whisky-800 font-medium">
              {tournament.participants?.length || 0} {tournament.participants?.length === 1 ? 'participant' : 'participants'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-xl">🏆</span>
          <div>
            <p className="text-whisky-800 font-medium capitalize">
              {tournament.type === 'single' ? 'Single Elimination' : 'Double Elimination'}
            </p>
          </div>
        </div>

        {tournament.gameTimeDuration && (
          <div className="flex items-start space-x-3">
            <span className="text-xl">⏱️</span>
            <div>
              <p className="text-whisky-800 font-medium">
                Time Control: {tournament.gameTimeDuration}
              </p>
            </div>
          </div>
        )}

        {tournament.adminComment && (
          <div className="mt-3 pt-3 border-t border-whisky-300">
            <p className="text-sm font-medium text-whisky-900 mb-1">Admin Note:</p>
            <p className="text-sm text-whisky-700 whitespace-pre-wrap">{tournament.adminComment}</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${
          message.includes('Successfully') || message.includes('already registered')
            ? 'bg-green-50 text-green-700 border border-green-400'
            : 'bg-red-50 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      {isPast ? (
        <button
          disabled
          className="w-full px-6 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed font-medium"
        >
          Tournament has passed
        </button>
      ) : tournament.status !== 'upcoming' ? (
        <button
          disabled
          className="w-full px-6 py-3 bg-gray-400 text-white rounded-md cursor-not-allowed font-medium"
        >
          Registration closed
        </button>
      ) : isRegistered ? (
        <button
          onClick={handleUnregister}
          disabled={loading}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Unregistering...' : 'Unregister from Tournament'}
        </button>
      ) : (
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full px-6 py-3 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register for Tournament'}
        </button>
      )}
    </div>
  );
}

