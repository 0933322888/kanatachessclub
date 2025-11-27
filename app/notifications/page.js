import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import connectDB from '../../lib/mongodb';
import Notification from '../../models/Notification';
import NotificationsClient from '../../components/NotificationsClient';

export const metadata = {
  title: 'Notifications',
  description: 'View all your tournament notifications and updates.',
};

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  await connectDB();

  const notifications = await Notification.find({ user: session.user.id })
    .populate('tournament', 'name')
    .sort({ createdAt: -1 })
    .limit(100);

  const unreadCount = await Notification.countDocuments({
    user: session.user.id,
    read: false,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-whisky-900">Notifications</h1>
        {unreadCount > 0 && (
          <span className="px-3 py-1 bg-amber text-white rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      <NotificationsClient 
        initialNotifications={JSON.parse(JSON.stringify(notifications))}
        initialUnreadCount={unreadCount}
      />
    </div>
  );
}

