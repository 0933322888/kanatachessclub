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
  const user = await User.findById(session.user.id);
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // Check if user has a password (not OAuth user) for password change functionality
  const hasPassword = user.password !== null && user.password !== undefined && user.provider !== 'google';
  
  // Remove password from user object before passing to client
  const userForClient = user.toObject();
  delete userForClient.password;

  return <ProfileClient user={JSON.parse(JSON.stringify(userForClient))} hasPassword={hasPassword} />;
}

