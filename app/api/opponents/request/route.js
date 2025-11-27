import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import OpponentRequest from '../../../../models/OpponentRequest';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { requestedId, gatheringDate } = body;

    if (!requestedId || !gatheringDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if request already exists
    const existing = await OpponentRequest.findOne({
      requester: session.user.id,
      requested: requestedId,
      gatheringDate: new Date(gatheringDate),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Request already sent' },
        { status: 400 }
      );
    }

    const opponentRequest = new OpponentRequest({
      requester: session.user.id,
      requested: requestedId,
      gatheringDate: new Date(gatheringDate),
      status: 'pending',
    });

    await opponentRequest.save();

    return NextResponse.json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Opponent request error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

