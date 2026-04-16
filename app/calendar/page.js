import { gatheringCalendarParts } from '../../lib/utils';
import { getUpcomingGatherings } from '../../lib/gatherings';
import Tournament from '../../models/Tournament';
import connectDB from '../../lib/mongodb';
import Link from 'next/link';

export const metadata = {
    title: 'Calendar',
    description: 'Upcoming events, gatherings, and tournaments at Kanata Chess Club.',
};

export default async function CalendarPage() {
    const gatheringsData = await getUpcomingGatherings(20);
    const gatherings = gatheringsData.map(g => g.date);
    let tournaments = [];

    try {
        await connectDB();
        const now = new Date();
        tournaments = await Tournament.find({
            status: 'upcoming',
            eventDate: { $gte: now },
        }).sort({ eventDate: 1 });
    } catch (error) {
        console.error('Error fetching tournaments:', error);
    }

    // Combine and sort events
    const allEvents = [
        ...gatherings.map(date => ({
            type: 'gathering',
            date: new Date(date),
            title: 'Biweekly Gathering',
            location: process.env.GATHERING_LOCATION || 'Tanger Outlets Food Court',
            time: process.env.GATHERING_TIME || '7pm - 9pm',
        })),
        ...tournaments.map(t => ({
            type: 'tournament',
            date: new Date(t.eventDate),
            title: t.name,
            location: t.location || 'TBD',
            time: 'Check details',
            id: t._id.toString(),
        })),
    ].sort((a, b) => a.date - b.date);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-whisky-900 text-white py-12 px-4 shadow-lg">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-amber-light">Calendar of Events</h1>
                    <p className="text-xl text-whisky-200">Join us for games, tournaments, and community.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="space-y-6">
                    {allEvents.length === 0 ? (
                        <p className="text-center text-gray-600">No upcoming events scheduled at the moment.</p>
                    ) : (
                        allEvents.map((event, index) => {
                            const gatheringParts =
                                event.type === 'gathering' ? gatheringCalendarParts(event.date) : null;
                            return (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center p-6 rounded-lg shadow-md border-l-4 ${event.type === 'tournament' ? 'bg-amber-50 border-amber-600' : 'bg-white border-whisky-400'
                                    } hover:shadow-lg transition-shadow`}
                            >
                                <div className="flex-shrink-0 text-center md:mr-8 mb-4 md:mb-0 min-w-[100px]">
                                    <div className="text-sm font-bold uppercase tracking-wider text-gray-500">
                                        {gatheringParts
                                            ? gatheringParts.monthShort
                                            : event.date.toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {gatheringParts ? gatheringParts.day : event.date.getDate()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {gatheringParts
                                            ? gatheringParts.weekdayShort
                                            : event.date.toLocaleString('default', { weekday: 'short' })}
                                    </div>
                                </div>

                                <div className="flex-grow text-center md:text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {event.type === 'tournament' && <span className="mr-2">🏆</span>}
                                        {event.title}
                                    </h3>
                                    <div className="text-gray-600 space-y-1">
                                        <p className="flex items-center justify-center md:justify-start">
                                            <span className="mr-2">📍</span> {event.location}
                                        </p>
                                        <p className="flex items-center justify-center md:justify-start">
                                            <span className="mr-2">⏰</span> {event.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex-shrink-0">
                                    {event.type === 'gathering' ? (
                                        <Link href="/next-gathering" className="px-6 py-2 bg-whisky-100 text-whisky-900 rounded-full hover:bg-whisky-200 font-medium transition-colors">
                                            Details
                                        </Link>
                                    ) : (
                                        <span className="px-6 py-2 bg-amber-100 text-amber-900 rounded-full font-medium">
                                            Tournament
                                        </span>
                                    )}
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
