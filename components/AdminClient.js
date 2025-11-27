'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminClient({ users, tournaments, stats }) {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const handleUpdateUser = async (userId, updates) => {
    setLoading({ ...loading, [userId]: true });
    setMessage('');

    try {
      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Update failed');
        return;
      }

      setMessage('User updated successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, [userId]: false });
    }
  };

  const handleToggleRole = (userId, currentRole) => {
    handleUpdateUser(userId, { role: currentRole === 'admin' ? 'user' : 'admin' });
  };

  const handleToggleBan = (userId, isBanned) => {
    // Note: We'd need to add a 'banned' field to the User model for this
    // For now, we'll just show a message
    setMessage('Ban functionality requires adding a banned field to the User model');
  };

  const handleResetGathering = async (gatheringDate) => {
    setLoading({ ...loading, reset: true });
    setMessage('');

    try {
      const response = await fetch('/api/admin/reset-gathering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gatheringDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Reset failed');
        return;
      }

      setMessage('Gathering matches reset successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading({ ...loading, reset: false });
    }
  };

  const handleDeleteTournament = async (tournamentId, tournamentName) => {
    if (!confirm(`Are you sure you want to delete "${tournamentName}"? This action cannot be undone.`)) {
      return;
    }

    setLoading({ ...loading, [`delete-${tournamentId}`]: true });
    setMessage('');

    try {
      const response = await fetch(`/api/tournaments/delete?id=${tournamentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Delete failed');
        return;
      }

      setMessage('Tournament deleted successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred while deleting the tournament');
    } finally {
      setLoading({ ...loading, [`delete-${tournamentId}`]: false });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      {message && (
        <div className={`mb-4 p-4 rounded-lg shadow-md border-2 ${
          message.includes('success')
            ? 'bg-whisky-100 text-whisky-800 border-amber'
            : 'bg-burgundy-light text-white border-burgundy'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-whisky-100 p-4 rounded-lg border-2 border-whisky-300">
            <p className="text-sm text-whisky-700">Total Users</p>
            <p className="text-2xl font-bold text-whisky-900">{stats.totalUsers}</p>
          </div>
          <div className="bg-whisky-100 p-4 rounded-lg border-2 border-whisky-300">
            <p className="text-sm text-whisky-700">Active Users</p>
            <p className="text-2xl font-bold text-whisky-900">{stats.activeUsers}</p>
          </div>
          <div className="bg-whisky-100 p-4 rounded-lg border-2 border-whisky-300">
            <p className="text-sm text-whisky-700">Total Tournaments</p>
            <p className="text-2xl font-bold text-whisky-900">{stats.totalTournaments}</p>
          </div>
        </div>
      </div>

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200">
        <div className="border-b-2 border-whisky-300">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-amber text-amber'
                  : 'text-whisky-600 hover:text-whisky-900'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'tournaments'
                  ? 'border-b-2 border-amber text-amber'
                  : 'text-whisky-600 hover:text-whisky-900'
              }`}
            >
              Tournaments
            </button>
            <button
              onClick={() => setActiveTab('gatherings')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'gatherings'
                  ? 'border-b-2 border-amber text-amber'
                  : 'text-whisky-600 hover:text-whisky-900'
              }`}
            >
              Gatherings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-whisky-200">
                <thead className="bg-whisky-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whisky-800 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whisky-800 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whisky-800 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whisky-800 uppercase tracking-wider">
                      Chess.com
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-whisky-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-whisky-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/users/${user._id}`}
                          className="text-sm font-medium text-whisky-900 hover:text-amber transition-colors"
                        >
                          {user.firstName} {user.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-whisky-700">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-amber text-white' : 'bg-whisky-200 text-whisky-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-whisky-700">
                        {user.chessComUsername || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleToggleRole(user._id, user.role)}
                          disabled={loading[user._id]}
                          className={`${
                            user.role === 'admin' ? 'text-burgundy hover:text-burgundy-dark' : 'text-amber hover:text-amber-dark'
                          } transition-colors`}
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div className="space-y-4">
              <Link
                href="/admin/tournaments/create"
                className="inline-block mb-4 px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
              >
                Create Tournament
              </Link>
              <div className="space-y-4">
                {tournaments.map((tournament) => (
                  <div key={tournament._id} className="border-2 border-whisky-300 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Link
                          href={`/tournaments/${tournament._id}`}
                          className="text-lg font-semibold text-whisky-900 hover:text-amber transition-colors"
                        >
                          {tournament.name}
                        </Link>
                        <p className="text-sm text-whisky-700">
                          {tournament.type} | {tournament.status} | {tournament.participants.length} participants
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {tournament.status === 'upcoming' && (
                          <Link
                            href={`/admin/tournaments/${tournament._id}/edit`}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
                          >
                            Edit
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteTournament(tournament._id, tournament.name)}
                          disabled={loading[`delete-${tournament._id}`]}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                        >
                          {loading[`delete-${tournament._id}`] ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gatherings' && (
            <div className="space-y-4">
              <p className="text-whisky-700 mb-4">
                Reset opponent matches for a specific gathering date.
              </p>
              <div className="border-2 border-whisky-300 rounded-lg p-4 bg-white">
                <label className="block text-sm font-medium text-whisky-800 mb-2">
                  Gathering Date
                </label>
                <input
                  type="date"
                  id="gatheringDate"
                  className="px-3 py-2 border-2 border-whisky-300 rounded-md bg-white text-whisky-900 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber"
                />
                <button
                  onClick={() => {
                    const dateInput = document.getElementById('gatheringDate');
                    if (dateInput.value) {
                      handleResetGathering(dateInput.value);
                    } else {
                      setMessage('Please select a date');
                    }
                  }}
                  disabled={loading.reset}
                  className="ml-4 px-4 py-2 bg-burgundy text-white rounded-md hover:bg-burgundy-dark shadow-md disabled:opacity-50 transition-colors font-medium"
                >
                  Reset Matches
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

