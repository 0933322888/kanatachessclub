'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTournamentClient({ users }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    type: 'single',
    participants: [],
    eventDate: '',
    gameTimeDuration: '',
    adminComment: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleParticipant = (userId) => {
    setFormData({
      ...formData,
      participants: formData.participants.includes(userId)
        ? formData.participants.filter(id => id !== userId)
        : [...formData.participants, userId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.name) {
      setMessage('Tournament name is required');
      return;
    }

    if (!formData.eventDate) {
      setMessage('Event date is required');
      return;
    }

    // Validate event date is in the future
    const eventDate = new Date(formData.eventDate);
    if (isNaN(eventDate.getTime())) {
      setMessage('Invalid event date');
      return;
    }

    if (eventDate < new Date()) {
      setMessage('Event date must be in the future');
      return;
    }

    // If participants are provided, validate they are a power of 2
    if (formData.participants.length > 0) {
      const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
      if (!isPowerOf2(formData.participants.length)) {
        setMessage('Number of participants must be a power of 2 (2, 4, 8, 16, etc.) or leave empty for open registration');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tournaments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Creation failed');
        return;
      }

      router.push(`/tournaments/${data.tournamentId}`);
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Tournament</h1>

      {message && (
        <div className={`mb-4 p-4 rounded ${
          message.includes('success')
            ? 'bg-green-50 text-green-700 border border-green-400'
            : 'bg-red-50 text-red-700 border border-red-400'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tournament Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tournament Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="single">Single Elimination</option>
            <option value="double">Double Elimination</option>
          </select>
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="datetime-local"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="gameTimeDuration" className="block text-sm font-medium text-gray-700">
            Game Time Duration
          </label>
          <input
            type="text"
            id="gameTimeDuration"
            name="gameTimeDuration"
            value={formData.gameTimeDuration}
            onChange={handleChange}
            placeholder="e.g., 15+10 (15 minutes + 10 seconds increment)"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Specify the time control for each game (e.g., "15+10", "10+5", "5+3")</p>
        </div>

        <div>
          <label htmlFor="adminComment" className="block text-sm font-medium text-gray-700">
            Admin Comment
          </label>
          <textarea
            id="adminComment"
            name="adminComment"
            value={formData.adminComment}
            onChange={handleChange}
            rows={4}
            placeholder="Add any additional information or notes about this tournament..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">Optional: Add comments or notes visible to all users</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Participants ({formData.participants.length} selected) - Optional
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Leave empty to allow open registration. If selecting participants, number must be a power of 2 (2, 4, 8, 16, etc.)
          </p>
          <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {users.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(user._id)}
                    onChange={() => toggleParticipant(user._id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900">
                    {user.firstName} {user.lastName}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </div>
  );
}

