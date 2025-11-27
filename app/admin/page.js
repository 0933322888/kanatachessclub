import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import Tournament from '../../models/Tournament';
import OpponentRequest from '../../models/OpponentRequest';
import AdminClient from '../../components/AdminClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();

  const users = await User.find().select('-password').sort({ createdAt: -1 });
  const tournaments = await Tournament.find().populate('participants').sort({ createdAt: -1 });
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ attendingNextGathering: true });

  return (
    <AdminClient
      users={JSON.parse(JSON.stringify(users))}
      tournaments={JSON.parse(JSON.stringify(tournaments))}
      stats={{
        totalUsers,
        activeUsers,
        totalTournaments: tournaments.length,
      }}
    />
  );
}

