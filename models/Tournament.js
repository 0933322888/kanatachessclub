import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
  },
  matchNumber: {
    type: Number,
    required: true,
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  score1: {
    type: Number,
    default: null,
  },
  score2: {
    type: Number,
    default: null,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  nextMatch: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  nextMatchSlot: {
    type: Number,
    default: null,
  },
});

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['single', 'double'],
    required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed'],
    default: 'upcoming',
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  matches: [matchSchema],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  gameTimeDuration: {
    type: String,
    default: '',
  },
  adminComment: {
    type: String,
    default: '',
  },
});

const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', tournamentSchema);

export default Tournament;

