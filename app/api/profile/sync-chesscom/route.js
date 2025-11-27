import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { syncChessComData } from '../../../../lib/chesscom';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Chess.com username is required' },
        { status: 400 }
      );
    }

    const chessComData = await syncChessComData(session.user.id, username);

    return NextResponse.json({ data: chessComData });
  } catch (error) {
    console.error('Chess.com sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync Chess.com data' },
      { status: 500 }
    );
  }
}

