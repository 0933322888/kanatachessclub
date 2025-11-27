import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import User from '../../models/User';
import ProfileClient from '../../components/ProfileClient';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();
  const user = await User.findById(session.user.id).select('-password');

  if (!user) {
    redirect('/auth/login');
  }

  return <ProfileClient user={JSON.parse(JSON.stringify(user))} />;
}

