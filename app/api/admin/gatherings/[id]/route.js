import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import connectDB from '../../../../../lib/mongodb';
import Gathering from '../../../../../models/Gathering';

export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        await connectDB();
        const result = await Gathering.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json({ error: 'Gathering override not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Gathering override deleted successfully' });
    } catch (error) {
        console.error('Delete gathering error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
