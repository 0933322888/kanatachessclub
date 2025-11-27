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

    // Check if tournament is still open for unregistration
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Cannot unregister from tournament that has already started' },
        { status: 400 }
      );
    }

    // Check if user is registered
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const participantIndex = tournament.participants.findIndex(p => 
      p.toString() === userId.toString()
    );
    
    if (participantIndex === -1) {
      return NextResponse.json(
        { error: 'You are not registered for this tournament' },
        { status: 400 }
      );
    }

    // Remove user from participants
    tournament.participants.splice(participantIndex, 1);
    
    // Clear matches if user was in the bracket (admin will need to re-pair)
    if (tournament.matches && tournament.matches.length > 0) {
      tournament.matches = [];
    }
    
    await tournament.save();

    return NextResponse.json({ 
      message: 'Successfully unregistered from tournament',
      tournament: {
        id: tournament._id.toString(),
        name: tournament.name,
        participantsCount: tournament.participants.length,
      },
    });
  } catch (error) {
    console.error('Tournament unregistration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

