import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import Tournament from '../../models/Tournament';
import Link from 'next/link';

export const metadata = {
  title: 'Tournaments',
  description: 'View all chess tournaments organized by Kanata Chess Club. Register for upcoming tournaments, view brackets, and track results.',
  openGraph: {
    title: 'Tournaments | Kanata Chess Club',
    description: 'View all chess tournaments organized by Kanata Chess Club. Register for upcoming tournaments, view brackets, and track results.',
  },
};

export default async function TournamentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();
  const tournaments = await Tournament.find()
    .populate('participants', 'firstName lastName')
    .populate('winner', 'firstName lastName')
    .populate('createdBy', 'firstName lastName')
    .sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-3">
          <span className="text-3xl sm:text-4xl">🏆</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-whisky-900">Tournaments</h1>
        </div>
        {session.user.role === 'admin' && (
          <Link
            href="/admin/tournaments/create"
            className="px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium text-center sm:text-left whitespace-nowrap"
          >
            Create Tournament
          </Link>
        )}
      </div>

      {tournaments.length === 0 ? (
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 text-center">
          <p className="text-whisky-700">No tournaments yet.</p>
          {session.user.role === 'admin' && (
            <Link
              href="/admin/tournaments/create"
              className="mt-4 inline-block px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Create First Tournament
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <Link
              key={tournament._id}
              href={`/tournaments/${tournament._id}`}
              className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6 hover:border-amber hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">♟️</span>
                <h2 className="text-xl font-semibold text-whisky-900">
                  {tournament.name}
                </h2>
              </div>
              <p className="text-sm text-whisky-700 mb-2">
                Type: {tournament.type === 'single' ? 'Single Elimination' : 'Double Elimination'}
              </p>
              <p className="text-sm text-whisky-700 mb-2">
                Status: <span className={`font-medium ${
                  tournament.status === 'completed' ? 'text-amber' :
                  tournament.status === 'in-progress' ? 'text-whisky-800' :
                  'text-whisky-600'
                }`}>
                  {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1).replace('-', ' ')}
                </span>
              </p>
              <p className="text-sm text-whisky-700 mb-2">
                Participants: {tournament.participants.length}
              </p>
              {tournament.winner && (
                <p className="text-sm font-medium text-amber">
                  Winner:{' '}
                  <span className="hover:underline">
                    {tournament.winner.firstName} {tournament.winner.lastName}
                  </span>
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

