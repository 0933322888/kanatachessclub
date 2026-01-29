import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import connectDB from '../../../../lib/mongodb';
import Tournament from '../../../../models/Tournament';

export const dynamic = 'force-dynamic';

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tournamentId = searchParams.get('id');

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const currentClubId = process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

    const tournament = await Tournament.findOne({ _id: tournamentId, clubId: currentClubId });
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found for this club' },
        { status: 404 }
      );
    }


    // Delete the tournament
    await Tournament.findByIdAndDelete(tournamentId);

    return NextResponse.json({
      message: 'Tournament deleted successfully',
    });
  } catch (error) {
    console.error('Tournament deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

