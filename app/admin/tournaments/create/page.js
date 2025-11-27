import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import CreateTournamentClient from '../../../../components/CreateTournamentClient';

export default async function CreateTournamentPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  await connectDB();
  const users = await User.find().select('firstName lastName').sort({ lastName: 1, firstName: 1 });

  return <CreateTournamentClient users={JSON.parse(JSON.stringify(users))} />;
}

