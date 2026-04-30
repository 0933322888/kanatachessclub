import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { getNextGatheringDate } from '../../../../lib/gatherings';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (body.attendingNextGathering !== undefined) {
      user.attendingNextGathering = body.attendingNextGathering;
      if (body.attendingNextGathering) {
        const targetDate = body.gatheringDate || await getNextGatheringDate();
        const gatheringDate = new Date(targetDate);
        if (Number.isNaN(gatheringDate.getTime())) {
          return NextResponse.json({ error: 'Invalid gatheringDate' }, { status: 400 });
        }
        gatheringDate.setHours(0, 0, 0, 0);
        user.attendingGatheringDate = gatheringDate;
      } else {
        user.attendingGatheringDate = null;
      }
    }

    await user.save();

    return NextResponse.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Attendance update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

