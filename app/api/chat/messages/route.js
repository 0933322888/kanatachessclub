import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Message from '../../../../models/Message';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gatheringDate = searchParams.get('gatheringDate');

    if (!gatheringDate) {
      return NextResponse.json(
        { error: 'Gathering date is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const messages = await Message.find({
      gatheringDate: new Date(gatheringDate),
    })
      .populate('user', 'firstName lastName chessComData.avatar')
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

