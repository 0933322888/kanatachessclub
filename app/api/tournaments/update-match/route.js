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
    const { tournamentId, matchId, score1, score2, winnerId } = body;

    if (!tournamentId || !matchId || score1 === undefined || score2 === undefined || !winnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (score1 === score2) {
      return NextResponse.json(
        { error: 'Scores cannot be equal' },
        { status: 400 }
      );
    }

    await connectDB();

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    const match = tournament.matches.id(matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    match.score1 = score1;
    match.score2 = score2;
    match.winner = winnerId;
    match.completed = true;

    // Update tournament status
    if (tournament.status === 'upcoming') {
      tournament.status = 'in-progress';
      tournament.startedAt = new Date();
    }

    // Advance winner to next round
    const nextRound = match.round + 1;
    if (nextRound <= Math.max(...tournament.matches.map(m => m.round))) {
      const nextRoundMatches = tournament.matches.filter(m => m.round === nextRound);
      const nextMatchNumber = Math.ceil(match.matchNumber / 2);
      const nextMatch = nextRoundMatches.find(m => m.matchNumber === nextMatchNumber);

      if (nextMatch) {
        const isFirstSlot = match.matchNumber % 2 === 1;
        if (isFirstSlot) {
          nextMatch.player1 = winnerId;
        } else {
          nextMatch.player2 = winnerId;
        }
      }
    }

    // Check if tournament is complete
    const finalMatch = tournament.matches.find(m => m.round === Math.max(...tournament.matches.map(m => m.round)));
    if (finalMatch && finalMatch.completed) {
      tournament.status = 'completed';
      tournament.winner = finalMatch.winner;
      tournament.completedAt = new Date();
    }

    await tournament.save();

    return NextResponse.json({ message: 'Match updated successfully' });
  } catch (error) {
    console.error('Match update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

