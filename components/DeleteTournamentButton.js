'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteTournamentButton({ tournamentId, tournamentName }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/tournaments/delete?id=${tournamentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete tournament');
        return;
      }

      // Redirect to tournaments page after successful deletion
      router.push('/tournaments');
    } catch (err) {
      alert('An error occurred while deleting the tournament');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-whisky-700">Delete "{tournamentName}"?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? 'Deleting...' : 'Confirm'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={loading}
          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md transition-colors font-medium"
    >
      Delete Tournament
    </button>
  );
}

