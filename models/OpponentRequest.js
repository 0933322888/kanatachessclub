import mongoose from 'mongoose';

const opponentRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requested: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  gatheringDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

opponentRequestSchema.index({ requester: 1, requested: 1, gatheringDate: 1 }, { unique: true });

const OpponentRequest = mongoose.models.OpponentRequest || mongoose.model('OpponentRequest', opponentRequestSchema);

export default OpponentRequest;

