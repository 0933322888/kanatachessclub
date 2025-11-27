import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, chessComUsername, preferredStrength } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await User.hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      chessComUsername: chessComUsername || null,
      preferredStrength: preferredStrength || 'Beginner',
    });

    await user.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

