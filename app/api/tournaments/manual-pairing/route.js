import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';

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
    const { tournamentId, matches } = body;

    if (!tournamentId || !matches) {
      return NextResponse.json(
        { error: 'Tournament ID and matches are required' },
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

    // Only allow pairing if tournament hasn't started
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Cannot update pairings for tournament that has already started' },
        { status: 400 }
      );
    }

    // Validate matches structure
    const numParticipants = tournament.participants.length;
    const rounds = Math.ceil(Math.log2(numParticipants));
    const bracketSize = Math.pow(2, rounds);
    const expectedMatches = bracketSize - 1; // Full bracket size

    if (matches.length !== expectedMatches) {
      return NextResponse.json(
        { error: `Invalid number of matches. Expected ${expectedMatches}, got ${matches.length}` },
        { status: 400 }
      );
    }

    // Validate all participants are used exactly once in first round
    const firstRoundMatches = matches.filter(m => m.round === 1);
    const usedParticipants = new Set();
    
    for (const match of firstRoundMatches) {
      if (match.player1) {
        const playerId = match.player1.toString();
        if (usedParticipants.has(playerId)) {
          return NextResponse.json(
            { error: `Participant used multiple times in first round` },
            { status: 400 }
          );
        }
        // Validate participant is in tournament
        if (!tournament.participants.some(p => p.toString() === playerId)) {
          return NextResponse.json(
            { error: `Participant is not in tournament` },
            { status: 400 }
          );
        }
        usedParticipants.add(playerId);
      }
      if (match.player2) {
        const playerId = match.player2.toString();
        if (usedParticipants.has(playerId)) {
          return NextResponse.json(
            { error: `Participant used multiple times in first round` },
            { status: 400 }
          );
        }
        // Validate participant is in tournament
        if (!tournament.participants.some(p => p.toString() === playerId)) {
          return NextResponse.json(
            { error: `Participant is not in tournament` },
            { status: 400 }
          );
        }
        usedParticipants.add(playerId);
      }
    }

    // Validate that all participants are used (if bracket is full)
    if (numParticipants === bracketSize && usedParticipants.size !== numParticipants) {
      return NextResponse.json(
        { error: 'All participants must be paired in the first round' },
        { status: 400 }
      );
    }

    // Update matches
    tournament.matches = matches;
    await tournament.save();

    return NextResponse.json({ 
      message: 'Manual pairings saved successfully',
      tournamentId: tournament._id.toString(),
    });
  } catch (error) {
    console.error('Manual pairing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

