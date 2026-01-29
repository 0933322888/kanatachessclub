import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Gathering from '@/models/Gathering';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const clubId = searchParams.get('clubId') || process.env.NEXT_PUBLIC_CLUB_ID || 'kanata';

        await connectDB();
        const gatherings = await Gathering.find({ clubId }).sort({ originalDate: 1 });

        return NextResponse.json(gatherings);
    } catch (error) {
        console.error('Fetch gatherings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { originalDate, overriddenDate, isCancelled, clubId, note } = body;

        if (!originalDate || !clubId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Find if an override already exists for this slot
        const filter = {
            originalDate: new Date(originalDate),
            clubId
        };

        const update = {
            overriddenDate: overriddenDate ? new Date(overriddenDate) : null,
            isCancelled: !!isCancelled,
            note,
        };

        const gathering = await Gathering.findOneAndUpdate(
            filter,
            update,
            { upsert: true, new: true }
        );

        return NextResponse.json(gathering);
    } catch (error) {
        console.error('Update gathering error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
