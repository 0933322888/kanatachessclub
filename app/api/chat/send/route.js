import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Message from '../../../../models/Message';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { gatheringDate, content } = body;

    if (!gatheringDate || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Gathering date and message content are required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Message is too long (max 500 characters)' },
        { status: 400 }
      );
    }

    await connectDB();

    const message = new Message({
      gatheringDate: new Date(gatheringDate),
      user: session.user.id,
      content: content.trim(),
    });

    await message.save();
    await message.populate('user', 'firstName lastName chessComData.avatar');

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

