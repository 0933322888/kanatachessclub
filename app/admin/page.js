import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import Tournament from '../../models/Tournament';
import Gathering from '../../models/Gathering';
import AdminClient from '../../components/AdminClient';
import { getNextGatheringDate } from '../../lib/gatherings';
import { getDefaultGatheringSlots } from '../../lib/gatherings';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  const currentClubId = process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

  await connectDB();

  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const tournaments = await Tournament.find().populate('participants').sort({ createdAt: -1 });
  const totalUsers = await User.countDocuments();
  const nextGathering = await getNextGatheringDate();
  const nextGatheringStart = new Date(nextGathering);
  nextGatheringStart.setHours(0, 0, 0, 0);
  const activeUsers = await User.countDocuments({
    attendingNextGathering: true,
    attendingGatheringDate: nextGatheringStart,
    clubs: currentClubId,
  });

  // Get raw gathering slots (default schedule)
  const gatheringSlots = getDefaultGatheringSlots(10, new Date(), currentClubId);

  // Get all existing overrides for these slots
  const gatheringOverrides = await Gathering.find({
    clubId: currentClubId,
    originalDate: { $in: gatheringSlots }
  });

  return (
    <AdminClient
      users={JSON.parse(JSON.stringify(users))}
      tournaments={JSON.parse(JSON.stringify(tournaments))}
      stats={{
        totalUsers,
        activeUsers,
        totalTournaments: tournaments.length,
      }}
      gatheringSlots={JSON.parse(JSON.stringify(gatheringSlots))}
      gatheringOverrides={JSON.parse(JSON.stringify(gatheringOverrides))}
      clubId={currentClubId}
    />
  );
}

