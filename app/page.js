import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { getNextGatheringDate, getAllUpcomingGatherings, formatDate } from '../lib/utils';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Tournament from '../models/Tournament';
import TournamentRegistration from '../components/TournamentRegistration';

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
        <h1 className="text-4xl font-bold text-whisky-900 mb-4">
          Welcome to Kanata Chess Club
        </h1>
        <p className="text-xl text-whisky-700 max-w-3xl mx-auto mb-6">
          A local community of chess enthusiasts. Join us for biweekly gatherings, tournaments, and friendly matches.
        </p>
        <div className="bg-whisky-100 rounded-lg border-2 border-whisky-300 p-6 max-w-3xl mx-auto">
          <ul className="space-y-3 text-left">
            <li className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">It is free to play.</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">Players of all ages and abilities are welcome.</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <span className="text-whisky-800 font-medium">Chess sets are provided by the club.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
          <h2 className="text-2xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
            Next Gathering
          </h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-lg text-whisky-800 font-medium">
                  {formatDate(nextGathering)}
                </p>
                <p className="text-sm text-whisky-600">Every second Wednesday</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="text-whisky-800 font-medium">{gatheringTime}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-whisky-800 font-medium">{gatheringLocation}</p>
              </div>
            </div>
            
            {attendeeCount > 0 && (
              <div className="flex items-start space-x-3">
                <span className="text-2xl">👥</span>
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
              Register
            </Link>
          )}
        </div>

        <div className="bg-whisky-50 rounded-lg shadow-lg border-2 border-whisky-200 p-6">
          <h2 className="text-2xl font-semibold text-whisky-900 mb-4 border-b-2 border-whisky-300 pb-2">
            Upcoming Events
          </h2>
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
          <h2 className="text-3xl font-bold text-whisky-900 mb-6">Upcoming Tournaments</h2>
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

