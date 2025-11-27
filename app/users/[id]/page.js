import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import PublicProfileClient from '../../../components/PublicProfileClient';

export default async function UserProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();
  const user = await User.findById(params.id).select('-password');

  if (!user) {
    redirect('/');
  }

  return <PublicProfileClient user={JSON.parse(JSON.stringify(user))} currentUserId={session.user.id} />;
}

