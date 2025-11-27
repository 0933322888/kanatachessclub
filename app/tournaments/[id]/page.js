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

export async function generateMetadata({ params }) {
  await connectDB();
  const tournament = await Tournament.findById(params.id)
    .populate('participants', 'firstName lastName')
    .populate('winner', 'firstName lastName');

  if (!tournament) {
    return {
      title: 'Tournament Not Found',
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || 'https://kanatachessclub.vercel.app';
  const description = tournament.adminComment 
    ? `${tournament.name} - ${tournament.type === 'single' ? 'Single' : 'Double'} Elimination Tournament. ${tournament.adminComment.substring(0, 100)}...`
    : `${tournament.name} - ${tournament.type === 'single' ? 'Single' : 'Double'} Elimination Tournament with ${tournament.participants.length} participants.`;

  return {
    title: tournament.name,
    description,
    openGraph: {
      title: `${tournament.name} | Kanata Chess Club`,
      description,
      type: 'website',
      url: `${siteUrl}/tournaments/${params.id}`,
    },
    twitter: {
      card: 'summary',
      title: tournament.name,
      description,
    },
  };
}

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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-whisky-900 break-words">{tournament.name}</h1>
          {session.user.role === 'admin' && (
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              {tournament.status === 'upcoming' && (
                <Link
                  href={`/admin/tournaments/${tournament._id}/edit`}
                  className="px-4 py-2 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium text-center sm:text-left whitespace-nowrap"
                >
                  Edit Tournament
                </Link>
              )}
              <DeleteTournamentButton tournamentId={tournament._id.toString()} tournamentName={tournament.name} />
            </div>
          )}
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-whisky-700">
            <span>Type: {tournament.type === 'single' ? 'Single Elimination' : 'Double Elimination'}</span>
            <span className="hidden sm:inline">|</span>
            <span>
              Status: <span className={`font-medium ${
                tournament.status === 'completed' ? 'text-amber' :
                tournament.status === 'in-progress' ? 'text-whisky-700' :
                'text-whisky-600'
              }`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1).replace('-', ' ')}
              </span>
            </span>
          </div>
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

