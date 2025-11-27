import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

// This is a one-time setup route
// Access it once to create admin, then disable or protect it
export async function POST(request) {
  try {
    // Simple protection - you should add better security in production
    const body = await request.json();
    if (body.secret !== process.env.SEED_SECRET || !process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const existingAdmin = await User.findOne({ email: 'admin@kanatachess.com' });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists' });
    }

    const adminPassword = await User.hashPassword('admin123');
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@kanatachess.com',
      password: adminPassword,
      role: 'admin',
      preferredStrength: 'Advanced',
    });

    await admin.save();

    return NextResponse.json({
      message: 'Admin user created',
      email: 'admin@kanatachess.com',
      password: 'admin123',
      warning: 'Change password immediately!',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

