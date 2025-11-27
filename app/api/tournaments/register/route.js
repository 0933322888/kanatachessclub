import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tournamentId } = body;

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
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

    // Check if tournament is still open for registration
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Tournament is no longer accepting registrations' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const isRegistered = tournament.participants.some(p => 
      p.toString() === userId.toString()
    );
    
    if (isRegistered) {
      return NextResponse.json(
        { error: 'You are already registered for this tournament' },
        { status: 400 }
      );
    }

    // Add user to participants
    tournament.participants.push(userId);
    await tournament.save();

    return NextResponse.json({ 
      message: 'Successfully registered for tournament',
      tournament: {
        id: tournament._id.toString(),
        name: tournament.name,
        participantsCount: tournament.participants.length,
      },
    });
  } catch (error) {
    console.error('Tournament registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

