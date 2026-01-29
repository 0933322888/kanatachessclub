import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Notification from '../../../../models/Notification';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentClubId = process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

    await connectDB();

    await Notification.updateMany(
      { user: session.user.id, read: false, clubId: currentClubId },
      { read: true }
    );


    return NextResponse.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

