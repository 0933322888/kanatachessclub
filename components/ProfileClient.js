'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ user: initialUser, hasPassword = false }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    chessComUsername: user.chessComUsername || '',
    preferredStrength: user.preferredStrength,
    manualRating: user.manualRating || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          manualRating: formData.manualRating ? parseInt(formData.manualRating) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Update failed');
        return;
      }

      setMessage('Profile updated successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');

    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage(data.error || 'Password change failed');
        return;
      }

      setPasswordMessage('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordMessage('An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSyncChessCom = async () => {
    if (!formData.chessComUsername) {
      setMessage('Please enter a Chess.com username first');
      return;
    }

    setSyncing(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile/sync-chesscom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.chessComUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Sync failed');
        return;
      }

      setMessage('Chess.com data synced successfully');
      router.refresh();
    } catch (err) {
      setMessage('An error occurred while syncing');
    } finally {
      setSyncing(false);
    }
  };

  const profilePicture = user.chessComData?.avatar || null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-6 mb-6 pb-6 border-b-2 border-whisky-300">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber shadow-lg mx-auto sm:mx-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-whisky-600 flex items-center justify-center border-4 border-amber shadow-lg mx-auto sm:mx-0">
              <span className="text-2xl sm:text-3xl font-bold text-amber">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-whisky-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-whisky-700 break-words">{user.email}</p>
            {user.chessComUsername && (
              <p className="text-sm text-whisky-600">Chess.com: {user.chessComUsername}</p>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg shadow-md border-2 ${
          message.includes('success') 
            ? 'bg-whisky-100 text-whisky-800 border-amber' 
            : 'bg-burgundy-light text-white border-burgundy-DEFAULT'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-whisky-800">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-whisky-800">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-whisky-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-whisky-100 text-whisky-600"
            />
          </div>

          <div>
            <label htmlFor="chessComUsername" className="block text-sm font-medium text-whisky-800">
              Chess.com Username
            </label>
            <div className="mt-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="chessComUsername"
                name="chessComUsername"
                value={formData.chessComUsername}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
                placeholder="username"
              />
              <button
                type="button"
                onClick={handleSyncChessCom}
                disabled={syncing || !formData.chessComUsername}
                className="w-full sm:w-auto px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
              >
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            </div>
          </div>

          {user.chessComData && user.chessComData.username && (
            <div className="bg-whisky-100 p-4 rounded-md border-2 border-whisky-300">
              <h3 className="font-semibold text-whisky-900 mb-2">Chess.com Data</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div>
                  <span className="text-whisky-700">Rapid:</span>{' '}
                  <span className="font-semibold text-whisky-900">{user.chessComData.rapid || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-whisky-700">Blitz:</span>{' '}
                  <span className="font-semibold text-whisky-900">{user.chessComData.blitz || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-whisky-700">Bullet:</span>{' '}
                  <span className="font-semibold text-whisky-900">{user.chessComData.bullet || 'N/A'}</span>
                </div>
              </div>
              {user.chessComData.lastSynced && (
                <p className="text-xs text-whisky-600 mt-2 break-words">
                  Last synced: {new Date(user.chessComData.lastSynced).toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="preferredStrength" className="block text-sm font-medium text-whisky-800">
              Preferred Playing Strength
            </label>
            <select
              id="preferredStrength"
              name="preferredStrength"
              value={formData.preferredStrength}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="manualRating" className="block text-sm font-medium text-whisky-800">
              Manual Rating (optional)
            </label>
            <input
              type="number"
              id="manualRating"
              name="manualRating"
              value={formData.manualRating}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
              placeholder="e.g., 1200"
            />
          </div>


          <div className="flex items-center">
            <input
              type="checkbox"
              id="attendingNextGathering"
              name="attendingNextGathering"
              checked={user.attendingNextGathering || false}
              onChange={async (e) => {
                setLoading(true);
                try {
                  const response = await fetch('/api/profile/update-attendance', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      attendingNextGathering: e.target.checked,
                    }),
                  });
                  if (response.ok) {
                    router.refresh();
                  }
                } catch (err) {
                  setMessage('An error occurred');
                } finally {
                  setLoading(false);
                }
              }}
              className="h-4 w-4 text-amber focus:ring-amber border-whisky-300 rounded"
            />
            <label htmlFor="attendingNextGathering" className="ml-2 block text-sm text-whisky-900">
              Attending next gathering
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {hasPassword && (
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
          <h2 className="text-xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
            Change Password
          </h2>
          
          {passwordMessage && (
            <div className={`mb-4 p-4 rounded-lg shadow-md border-2 ${
              passwordMessage.includes('success') 
                ? 'bg-whisky-100 text-whisky-800 border-amber' 
                : 'bg-burgundy-light text-white border-burgundy'
            }`}>
              {passwordMessage}
            </div>
          )}

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-whisky-800">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-whisky-800">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
                />
                <p className="mt-1 text-xs text-whisky-600">Must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-whisky-800">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full px-3 py-2 border-2 border-whisky-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber text-whisky-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md disabled:opacity-50 transition-colors font-medium"
                >
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setPasswordMessage('');
                  }}
                  className="px-4 py-2 bg-whisky-200 text-whisky-800 rounded-md hover:bg-whisky-300 border-2 border-whisky-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

