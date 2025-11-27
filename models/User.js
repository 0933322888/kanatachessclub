import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() {
      // Password is required only for credentials provider
      return !this.provider || this.provider === 'credentials';
    },
    default: null,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  providerId: {
    type: String,
    default: null,
  },
  chessComUsername: {
    type: String,
    default: null,
    trim: true,
  },
  preferredStrength: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  attendingNextGathering: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  chessComData: {
    username: String,
    avatar: String,
    rapid: Number,
    blitz: Number,
    bullet: Number,
    lastSynced: Date,
  },
  manualRating: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return bcrypt.hash(password, 12);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

