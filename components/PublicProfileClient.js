'use client';

import Link from 'next/link';

export default function PublicProfileClient({ user, currentUserId }) {
  const isOwnProfile = user._id === currentUserId;
  const profilePicture = user.chessComData?.avatar || null;

  const getPlayerRating = () => {
    if (user.chessComData?.rapid) {
      return `Rapid: ${user.chessComData.rapid}`;
    }
    if (user.manualRating) {
      return `Rating: ${user.manualRating}`;
    }
    return 'No rating';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isOwnProfile && (
        <div className="mb-4 p-4 bg-whisky-100 border-2 border-amber rounded-lg">
          <p className="text-whisky-800">
            This is your profile.{' '}
            <Link href="/profile" className="text-amber hover:text-amber-dark font-medium underline">
              Edit your profile
            </Link>
          </p>
        </div>
      )}

      <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 mb-6">
        <div className="flex items-center space-x-6 mb-6 pb-6 border-b-2 border-whisky-300">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-amber shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-whisky-600 flex items-center justify-center border-4 border-amber shadow-lg">
              <span className="text-4xl font-bold text-amber">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-whisky-900">
              {user.firstName} {user.lastName}
            </h1>
            {user.chessComUsername && (
              <p className="text-sm text-whisky-600 mt-1">
                Chess.com: <span className="font-medium">{user.chessComUsername}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-whisky-900 mb-3 border-b-2 border-whisky-300 pb-2">
              Playing Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-whisky-700">Preferred Strength:</p>
                <p className="font-medium text-whisky-900">{user.preferredStrength}</p>
              </div>
              <div>
                <p className="text-sm text-whisky-700">Rating:</p>
                <p className="font-medium text-whisky-900">{getPlayerRating()}</p>
              </div>
            </div>
          </div>

          {user.chessComData && user.chessComData.username && (
            <div>
              <h2 className="text-lg font-semibold text-whisky-900 mb-3 border-b-2 border-whisky-300 pb-2">
                Chess.com Stats
              </h2>
              <div className="bg-whisky-100 p-4 rounded-lg border-2 border-whisky-300">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-whisky-700">Rapid:</p>
                    <p className="font-semibold text-whisky-900 text-lg">
                      {user.chessComData.rapid || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-whisky-700">Blitz:</p>
                    <p className="font-semibold text-whisky-900 text-lg">
                      {user.chessComData.blitz || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-whisky-700">Bullet:</p>
                    <p className="font-semibold text-whisky-900 text-lg">
                      {user.chessComData.bullet || 'N/A'}
                    </p>
                  </div>
                </div>
                {user.chessComData.lastSynced && (
                  <p className="text-xs text-whisky-600 mt-3">
                    Last synced: {new Date(user.chessComData.lastSynced).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

