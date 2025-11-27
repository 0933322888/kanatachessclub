import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { tournamentId, name, type, participants, eventDate, gameTimeDuration, adminComment } = body;

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

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

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Only allow editing if tournament hasn't started
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Cannot edit tournament that has already started or completed' },
        { status: 400 }
      );
    }

    // Update basic fields
    tournament.name = name;
    tournament.type = type;
    tournament.eventDate = eventDateObj;
    tournament.gameTimeDuration = gameTimeDuration || '';
    tournament.adminComment = adminComment || '';

    // Handle participants update (without generating bracket - pairing is done separately)
    if (participants !== undefined) {
      tournament.participants = participants;
      // Clear matches if participants changed (admin will need to re-pair)
      if (tournament.matches.length > 0) {
        tournament.matches = [];
      }
    }

    await tournament.save();

    return NextResponse.json({ 
      message: 'Tournament updated successfully',
      tournamentId: tournament._id.toString(),
    });
  } catch (error) {
    console.error('Tournament update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

