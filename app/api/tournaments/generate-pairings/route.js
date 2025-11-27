import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';
import User from '../../../../models/User';
import { generateSingleEliminationBracket, generateDoubleEliminationBracket } from '../../../../lib/tournament';

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

    // Only allow pairing if tournament hasn't started
    if (tournament.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Cannot generate pairings for tournament that has already started' },
        { status: 400 }
      );
    }

    // Check if participants count is a power of 2
    const isPowerOf2 = (n) => n > 0 && (n & (n - 1)) === 0;
    if (!isPowerOf2(tournament.participants.length)) {
      return NextResponse.json(
        { error: 'Number of participants must be a power of 2' },
        { status: 400 }
      );
    }

    // Populate participants with user data (including ratings) for proper pairing
    const participantsWithData = await User.find({
      _id: { $in: tournament.participants }
    }).select('manualRating chessComData');

    // Create a map for quick lookup
    const participantsMap = new Map();
    participantsWithData.forEach(user => {
      participantsMap.set(user._id.toString(), user);
    });

    // Replace participant IDs with user objects
    const participantsForBracket = tournament.participants.map(id => 
      participantsMap.get(id.toString()) || id
    );

    // Generate bracket based on ratings
    let matches = [];
    if (tournament.type === 'single') {
      matches = generateSingleEliminationBracket(participantsForBracket);
    } else {
      const bracket = generateDoubleEliminationBracket(participantsForBracket);
      matches = bracket.winners;
    }

    tournament.matches = matches;
    await tournament.save();

    return NextResponse.json({ 
      message: 'Pairings generated successfully',
      tournamentId: tournament._id.toString(),
    });
  } catch (error) {
    console.error('Pairing generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

