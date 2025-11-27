import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';

export const dynamic = 'force-dynamic';

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
    const { name, type, participants = [], eventDate, gameTimeDuration, adminComment } = body;

    if (!name || !type || !eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, and eventDate are required' },
        { status: 400 }
      );
    }

    // Validate eventDate
    const eventDateObj = new Date(eventDate);
    if (isNaN(eventDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid event date' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create tournament without matches - pairing will be done manually or via pairing button
    const tournament = new Tournament({
      name,
      type,
      participants,
      matches: [],
      status: 'upcoming',
      createdBy: session.user.id,
      eventDate: eventDateObj,
      gameTimeDuration: gameTimeDuration || '',
      adminComment: adminComment || '',
    });

    await tournament.save();

    return NextResponse.json({ 
      message: 'Tournament created successfully',
      tournamentId: tournament._id.toString(),
    });
  } catch (error) {
    console.error('Tournament creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

