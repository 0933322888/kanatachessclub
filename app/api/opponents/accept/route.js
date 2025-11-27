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

    const body = await request.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const opponentRequest = await OpponentRequest.findById(requestId);

    if (!opponentRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    if (opponentRequest.requested.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (opponentRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request already processed' },
        { status: 400 }
      );
    }

    // Reject other pending requests for this gathering
    await OpponentRequest.updateMany(
      {
        $or: [
          { requester: session.user.id, gatheringDate: opponentRequest.gatheringDate, status: 'pending' },
          { requested: session.user.id, gatheringDate: opponentRequest.gatheringDate, status: 'pending' },
        ],
        _id: { $ne: requestId },
      },
      { status: 'rejected' }
    );

    // Reject other pending requests from the requester
    await OpponentRequest.updateMany(
      {
        requester: opponentRequest.requester,
        gatheringDate: opponentRequest.gatheringDate,
        status: 'pending',
        _id: { $ne: requestId },
      },
      { status: 'rejected' }
    );

    opponentRequest.status = 'accepted';
    await opponentRequest.save();

    return NextResponse.json({ message: 'Request accepted' });
  } catch (error) {
    console.error('Accept request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

