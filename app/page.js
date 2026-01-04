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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_background.png"
            alt="Chess board close up"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Kanata Chess Club Logo"
              width={100}
              height={100}
              className="rounded-full border-4 border-amber shadow-2xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 tracking-wide text-amber-light">
            Kanata Chess Club
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            A community of strategy, skill, and friendship. <br className="hidden sm:block" />
            Join us for biweekly gatherings and tournaments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!session && (
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-amber hover:bg-amber-dark text-white text-lg font-semibold rounded-md shadow-lg transition-all transform hover:-translate-y-1"
              >
                Join For Free
              </Link>
            )}
            <Link
              href="/next-gathering"
              className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white text-lg font-semibold rounded-md transition-all"
            >
              Next Gathering
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-amber flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
            <span className="text-4xl mb-4">♟️</span>
            <h3 className="text-xl font-bold font-serif text-whisky-900 mb-2">Free to Play</h3>
            <p className="text-whisky-700">No membership fees. Just bring your passion for the game.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-amber flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
            <span className="text-4xl mb-4">🤝</span>
            <h3 className="text-xl font-bold font-serif text-whisky-900 mb-2">All Skill Levels</h3>
            <p className="text-whisky-700">From beginners to masters, everyone is welcome.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-amber flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
            <span className="text-4xl mb-4">🎲</span>
            <h3 className="text-xl font-bold font-serif text-whisky-900 mb-2">Equipment Provided</h3>
            <p className="text-whisky-700">We provide standard tournament sets. You just show up.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Next Gathering Card */}
          <div className="bg-white rounded-xl shadow-lg okverflow-hidden border border-whisky-200 group">
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
              <Image
                src="/images/community_gathering.png"
                alt="Community Gathering"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div>
                  <h2 className="text-2xl font-bold text-white font-serif mb-1">Next Gathering</h2>
                  <p className="text-amber-light font-medium flex items-center">
                    <span className="mr-2">📅</span> {formatDate(nextGathering)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-whisky-100 flex items-center justify-center shrink-0">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <p className="font-semibold text-whisky-900">{gatheringLocation}</p>
                    <p className="text-sm text-whisky-600">Usually near the food court entrance</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-whisky-100 flex items-center justify-center shrink-0">
                    <span className="text-lg">⏰</span>
                  </div>
                  <div>
                    <p className="font-semibold text-whisky-900">{gatheringTime}</p>
                    <p className="text-sm text-whisky-600">Every other Wednesday</p>
                  </div>
                </div>

                {attendeeCount > 0 && (
                  <div className="flex items-center space-x-2 bg-whisky-50 p-3 rounded-md text-whisky-800 border border-whisky-200">
                    <div className="flex -space-x-2 overflow-hidden">
                      {[...Array(Math.min(3, attendeeCount))].map((_, i) => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-400"></div>
                      ))}
                    </div>
                    <span className="font-medium text-sm">
                      {attendeeCount} confirmed attending
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/next-gathering"
                className="block w-full text-center py-3 bg-whisky-900 text-white rounded-md hover:bg-whisky-800 transition-colors font-medium shadow-md"
              >
                View Details & RSVP
              </Link>
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-whisky-200 pb-2">
              <h2 className="text-2xl font-bold font-serif text-whisky-900">Upcoming Schedule</h2>
              <Link href="/calendar" className="text-amber-600 hover:text-amber-700 font-medium text-sm">View Full Calendar →</Link>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-whisky-200 overflow-hidden divide-y divide-whisky-100">
              {upcomingGatherings.map((date, index) => (
                <div key={index} className="flex items-center p-4 hover:bg-whisky-50 transition-colors">
                  <div className="bg-whisky-100 text-whisky-800 rounded-lg p-2 text-center min-w-[60px] mr-4">
                    <span className="block text-xs font-bold uppercase tracking-wider">{new Date(date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="block text-xl font-bold">{new Date(date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-whisky-900">Regular Club Gathering</h4>
                    <p className="text-sm text-whisky-600">{gatheringTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tournaments Section */}
        {tournamentsWithRegistration.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold font-serif text-whisky-900 mb-2">Upcoming Tournaments</h2>
                <p className="text-whisky-600">Test your skills in our competitive events.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/5 rounded-3xl -z-10 transform scale-105"></div>
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
          </div>
        )}
      </div>
    </div>
  );
}
