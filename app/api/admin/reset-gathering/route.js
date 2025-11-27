import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import OpponentRequest from '../../../../models/OpponentRequest';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { gatheringDate } = body;

    if (!gatheringDate) {
      return NextResponse.json(
        { error: 'Gathering date is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await OpponentRequest.deleteMany({
      gatheringDate: new Date(gatheringDate),
    });

    return NextResponse.json({ 
      message: 'Gathering matches reset successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Reset gathering error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

