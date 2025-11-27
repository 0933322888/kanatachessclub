/**
 * Seed script for creating initial data
 * Run with: node scripts/seed.mjs
 * Automatically loads MONGODB_URI from .env.local
 * 
 * Creates:
 * - 1 admin user
 * - 9 regular users (10 total users)
 * - 1 tournament with 8 participants
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env.local file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

// Load environment variables from .env.local
config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanatachess';

// Define User schema inline for the seed script
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  chessComUsername: { type: String, default: null, trim: true },
  preferredStrength: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  attendingNextGathering: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  chessComData: {
    username: String,
    avatar: String,
    rapid: Number,
    blitz: Number,
    bullet: Number,
    lastSynced: Date,
  },
  manualRating: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Define Tournament schema
const matchSchema = new mongoose.Schema({
  round: { type: Number, required: true },
  matchNumber: { type: Number, required: true },
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  score1: { type: Number, default: null },
  score2: { type: Number, default: null },
  completed: { type: Boolean, default: false },
  nextMatch: { type: mongoose.Schema.Types.ObjectId, default: null },
  nextMatchSlot: { type: Number, default: null },
});

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['single', 'double'], required: true },
  status: { type: String, enum: ['upcoming', 'in-progress', 'completed'], default: 'upcoming' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [matchSchema],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);

// Simple bracket generation for 8 players (single elimination)
function generateBracket(participantIds) {
  const matches = [];
  const numParticipants = participantIds.length;
  const rounds = Math.ceil(Math.log2(numParticipants));
  const bracketSize = Math.pow(2, rounds);
  
  // Generate first round matches
  for (let i = 0; i < bracketSize / 2; i++) {
    matches.push({
      round: 1,
      matchNumber: i + 1,
      player1: i * 2 < numParticipants ? participantIds[i * 2] : null,
      player2: i * 2 + 1 < numParticipants ? participantIds[i * 2 + 1] : null,
      winner: null,
      score1: null,
      score2: null,
      completed: false,
      nextMatch: null,
      nextMatchSlot: null,
    });
  }
  
  // Generate subsequent rounds
  let currentRoundMatches = bracketSize / 2;
  for (let round = 2; round <= rounds; round++) {
    const matchesInRound = currentRoundMatches / 2;
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        round: round,
        matchNumber: i + 1,
        player1: null,
        player2: null,
        winner: null,
        score1: null,
        score2: null,
        completed: false,
        nextMatch: null,
        nextMatchSlot: null,
      });
    }
    currentRoundMatches = matchesInRound;
  }
  
  return matches;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    // const existingUsers = await User.countDocuments();
    // if (existingUsers > 0) {
    //   console.log(`Database already has ${existingUsers} users. Skipping seed.`);
    //   await mongoose.connection.close();
    //   process.exit(0);
    // }

    const defaultPassword = await bcrypt.hash('admin123', 12);
    const users = [];

    // Create admin user
    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin2@kanatachess.com',
      password: defaultPassword,
      role: 'admin',
      preferredStrength: 'Advanced',
    });
    await admin.save();
    users.push(admin);
    console.log('✓ Admin user created');

    // Create 9 regular users
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda', 'James'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson'];
    const strengths = ['Beginner', 'Intermediate', 'Advanced'];

    for (let i = 0; i < 9; i++) {
      const user = new User({
        firstName: firstNames[i],
        lastName: lastNames[i],
        email: `user${i + 1}@kanatachess.com`,
        password: defaultPassword,
        role: 'user',
        preferredStrength: strengths[i % 3],
        manualRating: 1000 + (i * 100), // Varying ratings
      });
      await user.save();
      users.push(user);
      console.log(`✓ User ${i + 1} created: ${user.firstName} ${user.lastName}`);
    }

    console.log(`\nCreated ${users.length} users total`);

    // Create 1 tournament with 8 participants
    const participants = users.slice(0, 8); // Use first 8 users (including admin)
    const matches = generateBracket(participants.map(u => u._id));

    const tournament = new Tournament({
      name: 'Spring Championship 2024',
      type: 'single',
      status: 'upcoming',
      participants: participants.map(u => u._id),
      matches: matches,
      createdBy: admin._id,
    });

    await tournament.save();
    console.log(`✓ Tournament created: "${tournament.name}" with ${participants.length} participants`);

    console.log('\n=== Seed Summary ===');
    console.log(`Admin: admin@kanatachess.com / password123`);
    console.log(`Users: user1@kanatachess.com through user9@kanatachess.com / password123`);
    console.log(`Tournament: ${tournament.name} (ID: ${tournament._id})`);
    console.log('\nAll users have the same password: password123');
    console.log('Please change passwords after first login!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();

