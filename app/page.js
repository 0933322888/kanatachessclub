import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { getNextGatheringDate, getAllUpcomingGatherings, formatDate } from '../lib/utils';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentRegistration from '../components/TournamentRegistration';

export const metadata = {
  title: 'Home',
  description: 'Welcome to Kanata Chess Club - A local community of chess enthusiasts. Join us for biweekly gatherings, tournaments, and friendly matches. Free to play, all ages and abilities welcome.',
  openGraph: {
    title: 'Kanata Chess Club - Home',
    description: 'A local community of chess enthusiasts in Kanata. Join us for biweekly gatherings, tournaments, and friendly matches.',
  },
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const nextGathering = getNextGatheringDate();
  const upcomingGatherings = getAllUpcomingGatherings(5);

  // Get attendee count and tournaments
  let attendeeCount = 0;
  let upcomingTournaments = [];
  try {
    await connectDB();
    attendeeCount = await User.countDocuments({ attendingNextGathering: true });

    // Fetch upcoming tournaments (status: upcoming, eventDate in the future)
    const now = new Date();
    upcomingTournaments = await Tournament.find({
      status: 'upcoming',
      eventDate: { $gte: now },
    })
      .populate('participants', 'firstName lastName')
      .sort({ eventDate: 1 })
      .limit(5);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Gathering details
  const gatheringTime = process.env.GATHERING_TIME || '7pm - 9pm';
  const gatheringLocation = process.env.GATHERING_LOCATION || 'Tanger Outlets Food Court';

  // Check if user is registered for each tournament
  const userId = session?.user?.id;
  const tournamentsWithRegistration = upcomingTournaments.map(tournament => {
    const tournamentObj = tournament.toObject();
    let isRegistered = false;
    if (userId) {
      isRegistered = tournament.participants.some(p => {
        const participantId = typeof p === 'object' && p._id ? p._id.toString() : p.toString();
        return participantId === userId;
      });
    }
    return {
      ...tournamentObj,
      isRegistered,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src="/logo.svg"
              alt="Kanata Chess Club Logo"
              width={128}
              height={128}
              className="rounded-full border-4 border-amber shadow-xl"
            />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-whisky-900 mb-4">
          Welcome to Kanata Chess Club
        </h1>
        <p className="text-lg sm:text-xl text-whisky-700 max-w-3xl mx-auto mb-6 px-4">
          A local community of chess enthusiasts. Join us for biweekly gatherings, tournaments, and friendly matches.
        </p>
        <div className="bg-gradient-to-br from-whisky-100 to-whisky-50 rounded-lg border-2 border-whisky-300 p-6 max-w-3xl mx-auto">
          <ul className="space-y-3">
            <li className="flex items-center space-x-3 text-align-left">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">It is free to play.</span>
            </li>
            <li className="flex items-center space-x-3 text-align-left">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">Players of all ages and abilities are welcome.</span>
            </li>
            <li className="flex items-center space-x-3 text-align-left">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">Chess sets are provided by the club.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
          <div className="flex items-center space-x-3 mb-4 border-b-2 border-whisky-300 pb-2">
            <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-whisky-900">
              Next Gathering
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-whisky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-whisky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg text-whisky-800 font-medium">
                  {formatDate(nextGathering)}
                </p>
                <p className="text-sm text-whisky-600">Every other Wednesday</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-whisky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-whisky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-whisky-800 font-medium">{gatheringTime}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-whisky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-whisky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-whisky-800 font-medium">{gatheringLocation}</p>
              </div>
            </div>

            {attendeeCount > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-whisky-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-whisky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-whisky-800 font-medium">
                    {attendeeCount} {attendeeCount === 1 ? 'person' : 'people'} confirmed attending so far
                  </p>
                </div>
              </div>
            )}
          </div>

          {session ? (
            <Link
              href="/next-gathering"
              className="inline-block w-full text-center px-6 py-3 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              See details
            </Link>
          ) : (
            <Link
              href="/auth/register"
              className="inline-block w-full text-center px-6 py-3 bg-amber text-white rounded-md hover:bg-amber-dark shadow-md transition-colors font-medium"
            >
              Register For Free
            </Link>
          )}
        </div>

        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
          <div className="flex items-center space-x-3 mb-4 border-b-2 border-whisky-300 pb-2">
            <span className="text-3xl">📆</span>
            <h2 className="text-2xl font-semibold text-whisky-900">
              Upcoming Events
            </h2>
          </div>
          <ul className="space-y-3">
            {upcomingGatherings.map((date, index) => (
              <li key={index} className="flex items-center justify-between py-2 border-b border-whisky-300">
                <span className="text-whisky-800 font-medium">{formatDate(date)}</span>
                <span className="text-sm text-whisky-600">Biweekly Gathering</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {tournamentsWithRegistration.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center space-x-3 mb-6 px-4 sm:px-0">
            <span className="text-3xl sm:text-4xl">🏆</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-whisky-900">Upcoming Tournaments</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournamentsWithRegistration.map((tournament) => (
              <TournamentRegistration
                key={tournament._id.toString()}
                tournament={tournament}
                isRegistered={tournament.isRegistered}
                userId={userId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

