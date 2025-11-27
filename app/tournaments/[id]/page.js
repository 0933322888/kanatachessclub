import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectDB from '../../../lib/mongodb';
import Tournament from '../../../models/Tournament';
import TournamentBracket from '../../../components/TournamentBracket';
import TournamentPairing from '../../../components/TournamentPairing';
import DeleteTournamentButton from '../../../components/DeleteTournamentButton';
import { formatDate } from '../../../lib/utils';
import { serializeTournament } from '../../../lib/serialize';
import Link from 'next/link';

export default async function TournamentDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();
  const tournament = await Tournament.findById(params.id)
    .populate('participants', 'firstName lastName chessComData manualRating')
    .populate('matches.player1', 'firstName lastName')
    .populate('matches.player2', 'firstName lastName')
    .populate('matches.winner', 'firstName lastName')
    .populate('winner', 'firstName lastName')
    .populate('createdBy', 'firstName lastName');

  if (!tournament) {
    redirect('/tournaments');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-whisky-900">{tournament.name}</h1>
          {session.user.role === 'admin' && (
            <div className="flex space-x-2">
              {tournament.status === 'upcoming' && (
                <Link
                  href={`/admin/tournaments/${tournament._id}/edit`}
                  className="px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
                >
                  Edit Tournament
                </Link>
              )}
              <DeleteTournamentButton tournamentId={tournament._id.toString()} tournamentName={tournament.name} />
            </div>
          )}
        </div>
        <div className="space-y-2 mb-4">
          <p className="text-whisky-700">
            Type: {tournament.type === 'single' ? 'Single Elimination' : 'Double Elimination'} | 
            Status: <span className={`font-medium ${
              tournament.status === 'completed' ? 'text-amber' :
              tournament.status === 'in-progress' ? 'text-whisky-700' :
              'text-whisky-600'
            }`}>
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1).replace('-', ' ')}
            </span>
          </p>
          {tournament.eventDate && (
            <p className="text-whisky-700">
              Event Date: {formatDate(new Date(tournament.eventDate))} at{' '}
              {new Date(tournament.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          )}
          {tournament.gameTimeDuration && (
            <p className="text-whisky-700">
              Time Control: <span className="font-medium">{tournament.gameTimeDuration}</span>
            </p>
          )}
        </div>
        {tournament.adminComment && (
          <div className="mt-4 p-4 bg-whisky-100 border-2 border-whisky-300 rounded-lg">
            <p className="text-sm font-semibold text-whisky-900 mb-2">Admin Note:</p>
            <p className="text-whisky-800 whitespace-pre-wrap">{tournament.adminComment}</p>
          </div>
        )}
        {tournament.winner && (
          <div className="mt-4 p-4 bg-whisky-100 border-2 border-amber rounded-lg">
            <p className="text-lg font-semibold text-whisky-900">
              Winner:{' '}
              <Link
                href={`/users/${tournament.winner._id}`}
                className="text-amber hover:text-amber-dark transition-colors"
              >
                {tournament.winner.firstName} {tournament.winner.lastName}
              </Link>
            </p>
          </div>
        )}
      </div>

      <TournamentPairing 
        tournament={serializeTournament(tournament)} 
        isAdmin={session.user.role === 'admin'}
      />

      <TournamentBracket 
        tournament={serializeTournament(tournament)} 
        isAdmin={session.user.role === 'admin'}
      />
    </div>
  );
}

